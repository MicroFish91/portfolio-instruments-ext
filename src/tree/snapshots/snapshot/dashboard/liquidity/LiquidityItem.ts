import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../../SnapshotItem";
import { LiquidityResource, Snapshot } from "../../../../../sdk/types/snapshots";
import { viewPropertiesContext } from "../../../../../constants";
import { createContextValue } from "../../../../../utils/contextUtils";
import { capitalize } from "../../../../../utils/textUtils";

export class LiquidityItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'liquidityItem';
    static readonly regExp: RegExp = new RegExp(LiquidityItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly resourceIdx: number,
        readonly resource: LiquidityResource,
    ) {
        super(resource.holding_name);
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/liquidityBreakdown/${resourceIdx}`;
    }

    private getContextValue(): string {
        return createContextValue([LiquidityItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `${this.resource.account_name} ${this.resource.institution}:${capitalize(this.resource.tax_shelter)} $${this.resource.total.toFixed(2)} `,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("note", "white"),
        };
    }

    async viewProperties(): Promise<string> {
        return JSON.stringify(this.resource ?? {}, undefined, 4);
    }
}