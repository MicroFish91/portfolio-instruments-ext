import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotItem } from "./SnapshotItem";
import { Snapshot, SnapshotValue } from "../../../sdk/types/snapshots";
import { Account } from "../../../sdk/types/accounts";
import { Holding } from "../../../sdk/types/holdings";
import { capitalize } from "../../../utils/textUtils";

export class SnapshotValueItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotValueItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValueItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,

        readonly account: Account,
        readonly holding: Holding,
        readonly snapshot: Snapshot,
        readonly snapshotValue: SnapshotValue,
    ) {
        super(String(snapshotValue.snap_val_id));
        this.id = `/snapshots/${snapshot.snap_id}/snapshotValue/${snapshotValue.snap_val_id}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.holding.name,
            description: `${capitalize(this.account.institution)}:${capitalize(this.account.tax_shelter)} (${this.holding.asset_category}) $${this.snapshotValue.total.toFixed(2)} `,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    private getContextValues(): string {
        return createContextValue([SnapshotValueItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValue, undefined, 4);
    }
}