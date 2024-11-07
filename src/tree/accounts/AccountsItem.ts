import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAccounts } from "../../sdk/accounts/getAccounts";
import { Account } from "../../sdk/types/accounts";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { AccountItem } from "./AccountItem";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { ext } from "../../extensionVariables";

export class AccountsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountsItem';
    static readonly regExp: RegExp = new RegExp(AccountsItem.contextValue);

    id: string;

    constructor(readonly email: string) {
        super(l10n.t('Accounts'));
        this.id = `/users/${email}/accounts`;
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
        ext.resourceCache.set(AccountsItem.generatePiExtAccountsId(this.email), accounts);
        return accounts.map(a => new AccountItem(this, this.email, a));
    }

    private getContextValue(): string {
        return createContextValue([AccountsItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const accounts: Account[] = await AccountsItem.getAccountsWithCache(this.email);
        return JSON.stringify(accounts, undefined, 4);
    }

    static async getAccounts(email: string): Promise<Account[]> {
        const response = await getAccounts(nonNullValue(await getAuthToken(email)));
        return response.data?.accounts ?? [];
    }

    static async getAccountsWithCache(email: string): Promise<Account[]> {
        const cachedAccounts: Account[] | undefined = ext.resourceCache.get(AccountsItem.generatePiExtAccountsId(email));
        const accounts: Account[] = cachedAccounts ?? await AccountsItem.getAccounts(email);

        if (!cachedAccounts) {
            ext.resourceCache.set(AccountsItem.generatePiExtAccountsId(email), accounts);
        }

        return accounts;
    }

    static generatePiExtAccountsId(email: string): string {
        return `/users/${email}/accounts/`;
    }
}