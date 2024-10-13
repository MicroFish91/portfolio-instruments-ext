import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";

const createPlatformAccount: string = 'Create an account...';

export class RegisterItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'registerItem';
    static readonly regExp: RegExp = new RegExp(RegisterItem.contextValue);

    constructor() {
        super(createPlatformAccount);
    }

    getTreeItem(): TreeItem {
        return {
            id: 'pi/register',
            label: this.label,
            description: 'Register',
            contextValue: RegisterItem.contextValue,
            iconPath: new ThemeIcon("plus", "white"),
            command: {
                title: createPlatformAccount,
                command: 'portfolioInstruments.register',
                tooltip: 'Register',
            }
        };
    }
}