import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";

const loginPlatformAccount: string = l10n.t('Sign in...');

export class LoginItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'loginItem';
    static readonly regExp: RegExp = new RegExp(LoginItem.contextValue);

    constructor() {
        super(loginPlatformAccount);
    }

    getTreeItem(): TreeItem {
        return {
            id: 'pi/login',
            label: this.label,
            description: l10n.t('Login'),
            contextValue: LoginItem.contextValue,
            iconPath: new ThemeIcon('log-in', 'white'),
            command: {
                title: loginPlatformAccount,
                command: 'portfolioInstruments.login',
                tooltip: l10n.t('Login'),
            }
        };
    }
}