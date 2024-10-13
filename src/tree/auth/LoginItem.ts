import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";

const loginPlatformAccount: string = 'Sign in...';

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
            description: 'Login',
            contextValue: LoginItem.contextValue,
            iconPath: new ThemeIcon('log-in', 'white'),
            command: {
                title: loginPlatformAccount,
                command: 'portfolioInstruments.login',
                tooltip: 'Login',
            }
        };
    }
}