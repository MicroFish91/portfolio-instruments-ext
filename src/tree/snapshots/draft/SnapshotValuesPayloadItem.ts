import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { CreateSnapshotValuePayload } from "../../../sdk/snapshots/createSnapshot";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { SVPayloadItem } from "./SVPayloadItem";
import { AccountsItem } from "../../accounts/AccountsItem";
import { Account } from "../../../sdk/types/accounts";
import { Holding } from "../../../sdk/types/holdings";
import { HoldingsItem } from "../../holdings/HoldingsItem";
import { nonNullValue } from "../../../utils/nonNull";

export class SnapshotValuesPayloadItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotValuesPayloadItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValuesPayloadItem.contextValue);

    id: string;

    constructor(
        readonly draftItem: SnapshotDraftItem,
        readonly email: string,
        readonly snapshotValues: CreateSnapshotValuePayload[],
    ) {
        super('Values');
        this.id = `/emails/${email}/snapshots/draft/snapshotValues`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.Expanded,
            iconPath: new ThemeIcon("array", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const accounts: Account[] = await AccountsItem.getAccounts(this.email);
        const accountsMap = new Map<number, Account>();

        for (const account of accounts) {
            accountsMap.set(account.account_id, account);
        }

        const holdings: Holding[] = await HoldingsItem.getHoldings(this.email);
        const holdingsMap = new Map<number, Holding>();

        for (const holding of holdings) {
            holdingsMap.set(holding.holding_id, holding);
        }

        return this.snapshotValues.map((sv, i) => new SVPayloadItem(
            this.draftItem,
            this.email,
            i,
            sv,
            nonNullValue(accountsMap.get(sv.account_id)),
            nonNullValue(holdingsMap.get(sv.holding_id)),
        ));
    }

    private getContextValues(): string {
        return createContextValue([SnapshotValuesPayloadItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValues, undefined, 4);
    }
}