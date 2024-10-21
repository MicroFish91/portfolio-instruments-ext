import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";

const createPlatformAccount: string = l10n.t('Create an account...');

export class RegisterItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'registerItem';
    static readonly regExp: RegExp = new RegExp(RegisterItem.contextValue);

    constructor() {
        super(createPlatformAccount);
    }

    getTreeItem(): TreeItem {
        return {
            id: '/register',
            label: this.label,
            description: l10n.t('Register'),
            contextValue: RegisterItem.contextValue,
            iconPath: new ThemeIcon("plus", "white"),
            command: {
                title: createPlatformAccount,
                command: 'portfolioInstruments.register',
                tooltip: l10n.t('Register'),
            }
        };
    }
}