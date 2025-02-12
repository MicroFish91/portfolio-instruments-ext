import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { reorderableContext, viewPropertiesContext } from "../../../constants";
import { SnapshotItem } from "./SnapshotItem";
import { Snapshot, SnapshotValue } from "../../../sdk/types/snapshots";
import { Account } from "../../../sdk/types/accounts";
import { Holding } from "../../../sdk/types/holdings";
import { capitalize } from "../../../utils/textUtils";
import { Reorderable } from "../../reorder";
import { SnapshotValuesItem } from "./SnapshotValuesItem";

export class SnapshotValueItem extends TreeItem implements PiExtTreeItem, Reorderable {
    static readonly contextValue: string = 'snapshotValueItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValueItem.contextValue);

    id: string;
    kind = 'snapshotValue';

    constructor(
        readonly grandParent: SnapshotItem,
        readonly parent: SnapshotValuesItem,
        readonly email: string,

        readonly account: Account,
        readonly holding: Holding,
        readonly snapshot: Snapshot,
        readonly snapshotValue: SnapshotValue,
    ) {
        super(String(snapshotValue.snap_val_id));
        this.id = `/snapshots/${snapshot.snap_id}/snapshotValue/${snapshotValue.snap_val_id}`;
        this.contextValue = createContextValue([SnapshotValueItem.contextValue, reorderableContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: `${this.holding.name} (${this.holding.asset_category})`,
            description: `${this.account.name} ${this.account.institution}:${capitalize(this.account.tax_shelter)} $${this.snapshotValue.total.toFixed(2)} `,
            contextValue: this.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValue, undefined, 4);
    }

    getResourceId(): string {
        return this.snapshotValue.snap_val_id.toString();
    }
}