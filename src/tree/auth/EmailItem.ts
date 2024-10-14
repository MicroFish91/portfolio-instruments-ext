import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { AccountsItem } from "../accounts/AccountsItem";

export class EmailItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'emailItem';
    static readonly regExp: RegExp = new RegExp(EmailItem.contextValue);

    readonly email: string;

    constructor(email: string) {
        super(email);
        this.email = email;
    }

    getTreeItem(): TreeItem {
        return {
            id: `/email/${this.label}`,
            label: this.label,
            description: l10n.t('Email'),
            contextValue: EmailItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("account", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] {
        return [
            new AccountsItem(this.email),
        ];
    }
}