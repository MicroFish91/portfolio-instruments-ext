import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { GetUserByToken, getUserByToken } from "../../sdk/auth/getUserByToken";
import { nonNullValue } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";

export class SettingsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'settingsItem';
    static readonly regExp: RegExp = new RegExp(SettingsItem.contextValue);

    readonly email: string;

    constructor(email: string) {
        super(l10n.t('Settings'));
        this.email = email;
        this.id = `/emails/${this.email}/settings`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("gear", "white"),
        };
    }

    private getContextValue(): string {
        return createContextValue([SettingsItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const response: GetUserByToken = await getUserByToken(nonNullValue(await getAuthToken(this.email)));
        return JSON.stringify(response.data?.settings ?? {}, undefined, 4);
    }
}