import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../SnapshotItem";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue } from "../../../../utils/nonNull";
import { createContextValue } from "../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../constants";
import { GenericItem } from "../../../GenericItem";
import { getSnapshotByTaxShelter } from "../../../../sdk/snapshots/getSnapshotByTaxShelter";
import { GetSnapshotAccountsResponse, ResourcesGrouped, Snapshot, SnapshotValue } from "../../../../sdk/portfolio-instruments-api";

export class SnapshotByTaxShelterItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotByTaxShelterItem';
    static readonly regExp: RegExp = new RegExp(SnapshotByTaxShelterItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly snapshotValues: SnapshotValue[],
    ) {
        super('Tax Shelter Breakdown');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/taxShelterBreakdown`;
    }

    private getContextValue(): string {
        return createContextValue([SnapshotByTaxShelterItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("graph", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const { fields: taxShelters, total: totals } = nonNullValue(await SnapshotByTaxShelterItem.getSnapshotByTaxShelter(this.email, this.snapshotData.snap_id));
        return taxShelters.map((shelter, i) => {
            const percent: number = Math.round(totals[i] / this.snapshotData.total * 100);
            return new GenericItem({
                id: `${this.id}/${i}`,
                label: shelter,
                description: `${totals[i].toFixed(2)} (${percent}%)`,
                contextValue: 'snapshotTaxShelterItem',
                iconPath: new ThemeIcon('folder', 'white'),
            });
        });
    }

    static async getSnapshotByTaxShelter(email: string, snapId: number): Promise<ResourcesGrouped | undefined> {
        const response: GetSnapshotAccountsResponse = await getSnapshotByTaxShelter(nonNullValue(await getAuthToken(email)), snapId);
        return response.data?.accounts_grouped;
    }

    async viewProperties(): Promise<string> {
        const response = await SnapshotByTaxShelterItem.getSnapshotByTaxShelter(this.email, this.snapshotData.snap_id);
        return JSON.stringify(response ?? {}, undefined, 4);
    }
}