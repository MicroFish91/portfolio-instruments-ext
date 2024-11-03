import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotItem } from "./SnapshotItem";
import { Snapshot, SnapshotValue } from "../../../sdk/types/snapshots";
import { Account } from "../../../sdk/types/accounts";
import { AccountsItem } from "../../accounts/AccountsItem";
import { HoldingsItem } from "../../holdings/HoldingsItem";
import { Holding } from "../../../sdk/types/holdings";
import { SnapshotValueItem } from "./SnapshotValueItem";
import { nonNullValue } from "../../../utils/nonNull";

export class SnapshotValuesItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotValuesItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValuesItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,

        readonly snapshot: Snapshot,
        readonly snapshotValues: SnapshotValue[],
    ) {
        super('Values');
        this.id = `/snapshots/${snapshot.snap_id}/snapshotValues`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("array", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const accounts: Account[] = await AccountsItem.getAccountsWithCache(this.email);
        const accountsMap = new Map<number, Account>();

        for (const account of accounts) {
            accountsMap.set(account.account_id, account);
        }

        const holdings: Holding[] = await HoldingsItem.getHoldingsWithCache(this.email);
        const holdingsMap = new Map<number, Holding>();

        for (const holding of holdings) {
            holdingsMap.set(holding.holding_id, holding);
        }

        return this.snapshotValues.map(sv => new SnapshotValueItem(
            this.parent,
            this.email,
            nonNullValue(accountsMap.get(sv.account_id)),
            nonNullValue(holdingsMap.get(sv.holding_id)),
            this.snapshot,
            sv,
        ));
    }

    private getContextValues(): string {
        return createContextValue([SnapshotValuesItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValues, undefined, 4);
    }
}