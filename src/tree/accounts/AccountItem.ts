import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Account } from "../../sdk/types/accounts";

export class AccountItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountItem';
    static readonly regExp: RegExp = new RegExp(AccountItem.contextValue);

    constructor(readonly email: string, readonly account: Account) {
        super(account.name);
    }

    getTreeItem(): TreeItem {
        return {
            id: `/email/${this.email}/accounts/${this.account.name}`,
            label: this.label,
            contextValue: AccountItem.contextValue,
            iconPath: new ThemeIcon("dash", "white"),
        };
    }
}