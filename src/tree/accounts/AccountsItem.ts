import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAccounts } from "../../sdk/accounts/getAccounts";
import { Account } from "../../sdk/types/accounts";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { AccountItem } from "./AccountItem";

export class AccountsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountsItem';
    static readonly regExp: RegExp = new RegExp(AccountsItem.contextValue);

    constructor(readonly email: string) {
        super(l10n.t('Accounts'));
    }

    getTreeItem(): TreeItem {
        return {
            id: `/email/${this.email}/accounts`,
            label: this.label,
            contextValue: AccountsItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("home", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const response = await getAccounts(nonNullValue(await getAuthToken(this.email)));
        if (response.error) {
            throw new Error(response.error);
        }

        const accounts: Account[] = response.data?.accounts ?? [];
        return accounts.map(a => new AccountItem(this.email, a));
    }
}