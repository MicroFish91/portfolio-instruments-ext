import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { AccountsItem } from "../accounts/AccountsItem";
import { getUserByToken } from "../../sdk/auth/getUserByToken";
import { nonNullValue, nonNullValueAndProp } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { GenericItem } from "../GenericItem";
import { HoldingsItem } from "../holdings/HoldingsItem";
import { BenchmarksItem } from "../benchmarks/BenchmarksItem";
import { SnapshotsItem } from "../snapshots/SnapshotsItem";
import { ext } from "../../extensionVariables";
import { GetMeResponse, User } from "../../sdk/portfolio-instruments-api";

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
        const response: GetMeResponse = await getUserByToken(nonNullValue(await getAuthToken(this.email)));

        if (response.data) {
            ext.resourceCache.set(EmailItem.generatePiExtUserId(this.email), response.data?.user);

            return [
                new SnapshotsItem(this.email),
                new AccountsItem(this.email),
                new HoldingsItem(this.email),
                new BenchmarksItem(this.email),
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

    static async getUser(email: string): Promise<User> {
        return nonNullValueAndProp(await getUserByToken(nonNullValue(await getAuthToken(email))), 'data').user;
    }

    static async getUserWithCache(email: string): Promise<User> {
        let user: User | undefined = ext.resourceCache.get(EmailItem.generatePiExtUserId(email));

        if (!user) {
            user = await EmailItem.getUser(email);
            ext.resourceCache.set(EmailItem.generatePiExtUserId(email), user);
        }

        return user;
    }

    static generatePiExtUserId(email: string): string {
        return `/users/${email}`;
    }
}