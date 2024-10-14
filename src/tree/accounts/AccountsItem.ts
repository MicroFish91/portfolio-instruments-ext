import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";

export class AccountsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountsItem';
    static readonly regExp: RegExp = new RegExp(AccountsItem.contextValue);

    constructor(private readonly email: string) {
        super(l10n.t('Accounts'));
    }

    getTreeItem(): TreeItem {
        return {
            id: `/email/${this.email}/accounts`,
            label: this.label,
            contextValue: AccountsItem.contextValue,
            iconPath: new ThemeIcon("home", "white"),
        };
    }
}