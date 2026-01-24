import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../SnapshotItem";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue } from "../../../../utils/nonNull";
import { createContextValue } from "../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../constants";
import { GenericItem } from "../../../GenericItem";
import { getSnapshotByAssetCategory } from "../../../../sdk/snapshots/getSnapshotByAssetCategory";
import { GetSnapshotHoldingsResponse, ResourcesGrouped, Snapshot, SnapshotValue } from "../../../../sdk/portfolio-instruments-api";

export class SnapshotByAssetCategoryItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotByAssetCategoryItem';
    static readonly regExp: RegExp = new RegExp(SnapshotByAssetCategoryItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly snapshotValues: SnapshotValue[],
    ) {
        super('Asset Category Breakdown');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/assetCategoryBreakdown`;
    }

    private getContextValue(): string {
        return createContextValue([SnapshotByAssetCategoryItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("pie-chart", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const { fields: assetCategories, total: totals } = nonNullValue(await SnapshotByAssetCategoryItem.getSnapshotByAssetCategory(this.email, this.snapshotData.snap_id));
        return assetCategories.map((category, i) => {
            const percent: number = Math.round(totals[i] / this.snapshotData.total * 100);
            return new GenericItem({
                id: `${this.id}/${i}`,
                label: category,
                description: `${totals[i].toFixed(2)} (${percent}%)`,
                contextValue: 'snapshotAssetCategoryItem',
                iconPath: new ThemeIcon('pie-chart', 'white'),
            });
        });
    }

    static async getSnapshotByAssetCategory(email: string, snapId: number): Promise<ResourcesGrouped | undefined> {
        const response: GetSnapshotHoldingsResponse = await getSnapshotByAssetCategory(nonNullValue(await getAuthToken(email)), snapId);
        return response.data?.holdings_grouped;
    }

    async viewProperties(): Promise<string> {
        const response = await SnapshotByAssetCategoryItem.getSnapshotByAssetCategory(this.email, this.snapshotData.snap_id);
        return JSON.stringify(response ?? {}, undefined, 4);
    }
}