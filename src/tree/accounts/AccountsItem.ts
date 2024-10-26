import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAccounts } from "../../sdk/accounts/getAccounts";
import { Account } from "../../sdk/types/accounts";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { AccountItem } from "./AccountItem";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";

export class AccountsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountsItem';
    static readonly regExp: RegExp = new RegExp(AccountsItem.contextValue);

    id: string;

    constructor(readonly email: string) {
        super(l10n.t('Accounts'));
        this.id = `/emails/${email}/accounts`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon('home', 'white'),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const accounts: Account[] = await AccountsItem.getAccounts(this.email);
        return accounts.map(a => new AccountItem(this, this.email, a));
    }

    static async getAccounts(email: string): Promise<Account[]> {
        const response = await getAccounts(nonNullValue(await getAuthToken(email)));
        return response.data?.accounts ?? [];
    }

    private getContextValue(): string {
        return createContextValue([AccountsItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const accounts: Account[] = await AccountsItem.getAccounts(this.email);
        return JSON.stringify(accounts, undefined, 4);
    }
}