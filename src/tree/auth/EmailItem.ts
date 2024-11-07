import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { AccountsItem } from "../accounts/AccountsItem";
import { GetUserByTokenApiResponse, getUserByToken } from "../../sdk/auth/getUserByToken";
import { nonNullProp, nonNullValue, nonNullValueAndProp } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { GenericItem } from "../GenericItem";
import { HoldingsItem } from "../holdings/HoldingsItem";
import { BenchmarksItem } from "../benchmarks/BenchmarksItem";
import { SettingsItem } from "../settings/SettingsItem";
import { SnapshotsItem } from "../snapshots/SnapshotsItem";
import { ext } from "../../extensionVariables";
import { Settings } from "../../sdk/types/settings";
import { User } from "../../sdk/types/user";

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
            id: `/users/${this.label}`,
            label: this.label,
            description: l10n.t('Email'),
            contextValue: EmailItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("account", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const response: GetUserByTokenApiResponse = await getUserByToken(nonNullValue(await getAuthToken(this.email)));

        if (response.data) {
            ext.resourceCache.set(EmailItem.generatePiExtUserId(this.email), response.data?.user);
            ext.resourceCache.set(SettingsItem.generatePiExtSettingsId(this.email), response.data?.settings);

            return [
                new SnapshotsItem(this.email, response.data.settings),
                new AccountsItem(this.email),
                new HoldingsItem(this.email),
                new BenchmarksItem(this.email),
                new SettingsItem(this.email),
            ];
        } else {
            return [
                new GenericItem({
                    id: `/users/${this.email}/refreshLogin`,
                    label: l10n.t('Credentials are stale. Refresh login to proceed.'),
                    contextValue: 'refreshLoginItem',
                    command: {
                        title: 'Refresh login...',
                        command: 'portfolioInstruments.refreshLogin',
                        arguments: [this],
                    }
                }),
            ];
        }
    }

    static async getUserAndSettings(email: string): Promise<{ user: User; settings: Settings }> {
        return nonNullValueAndProp(await getUserByToken(nonNullValue(await getAuthToken(email))), 'data');
    }

    static async getUserAndSettingsWithCache(email: string): Promise<{ user: User; settings: Settings }> {
        const cachedUser: User | undefined = ext.resourceCache.get(EmailItem.generatePiExtUserId(email));
        const cachedSettings: Settings | undefined = ext.resourceCache.get(SettingsItem.generatePiExtSettingsId(email));

        let userAndSettings = { user: cachedUser, settings: cachedSettings };
        if (!cachedUser || !cachedSettings) {
            userAndSettings = await EmailItem.getUserAndSettings(email);
            ext.resourceCache.set(EmailItem.generatePiExtUserId(email), userAndSettings.user);
            ext.resourceCache.set(SettingsItem.generatePiExtSettingsId(email), userAndSettings.settings);
        }

        return { user: nonNullProp(userAndSettings, 'user'), settings: nonNullProp(userAndSettings, 'settings') };
    }

    static generatePiExtUserId(email: string): string {
        return `/users/${email}`;
    }
}