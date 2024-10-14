import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";

export class EmailItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'emailItem';
    static readonly regExp: RegExp = new RegExp(EmailItem.contextValue);

    constructor(label: string) {
        super(label);
    }

    getTreeItem(): TreeItem {
        return {
            id: `/email/${this.label}`,
            label: this.label,
            description: l10n.t('Email'),
            contextValue: EmailItem.contextValue,
            iconPath: new ThemeIcon("account", "white"),
        };
    }
}