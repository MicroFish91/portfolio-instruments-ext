import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../../SnapshotItem";
import { createContextValue } from "../../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../../constants";
import { getSnapshotByLiquidity } from "../../../../../sdk/snapshots/getSnapshotByLiquidity";
import { nonNullValue } from "../../../../../utils/nonNull";
import { getAuthToken } from "../../../../../utils/tokenUtils";
import { LiquidityItem } from "./LiquidityItem";
import { GenericItem } from "../../../../GenericItem";
import { GetSnapshotLiquidityResponse, LiquidityResource, Snapshot, SnapshotValue } from "../../../../../sdk/portfolio-instruments-api";

export class SnapshotByLiquidityItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotByLiquidityItem';
    static readonly regExp: RegExp = new RegExp(SnapshotByLiquidityItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly snapshotValues: SnapshotValue[],
    ) {
        super('Liquidity Breakdown');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/liquidityBreakdown`;
    }

    private getContextValue(): string {
        return createContextValue([SnapshotByLiquidityItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("beaker", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const resources: GetSnapshotLiquidityResponse = await getSnapshotByLiquidity(nonNullValue(await getAuthToken(this.email)), this.snapshotData.snap_id);
        return [
            // Liquidity Items
            ...resources.data?.resources
                ?.filter(r => r.total > 0)
                ?.sort((a, b) => b.total - a.total)
                ?.map((r, idx) => new LiquidityItem(this.parent, this.email, this.snapshotData, idx, r)) ?? [],
            // Total
            new GenericItem({
                id: `${this.id}/liquidityTotal`,
                label: '$' + String(resources.data?.liquid_total ?? 0),
                description: 'Total',
                contextValue: 'liquidityTotalItem',
                iconPath: new ThemeIcon('beaker', 'white'),
            }),
        ];
    }

    static async getSnapshotByLiquidity(email: string, snapId: number): Promise<LiquidityResource[] | undefined> {
        const response: GetSnapshotLiquidityResponse = await getSnapshotByLiquidity(nonNullValue(await getAuthToken(email)), snapId);
        return response.data?.resources;
    }

    async viewProperties(): Promise<string> {
        const response: GetSnapshotLiquidityResponse = await getSnapshotByLiquidity(nonNullValue(await getAuthToken(this.email)), this.snapshotData.snap_id);
        return JSON.stringify(response.data ?? {}, undefined, 4);
    }
}