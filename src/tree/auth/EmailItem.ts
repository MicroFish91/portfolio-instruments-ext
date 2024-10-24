import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { AccountsItem } from "../accounts/AccountsItem";
import { GetUserByToken, getUserByToken } from "../../sdk/auth/getUserByToken";
import { nonNullValue } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { GenericItem } from "../GenericItem";
import { HoldingsItem } from "../holdings/HoldingsItem";
import { BenchmarksItem } from "../benchmarks/BenchmarksItem";
import { SettingsItem } from "../settings/SettingsItem";
import { SnapshotsItem } from "../snapshots/SnapshotsItem";

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
            id: `/emails/${this.label}`,
            label: this.label,
            description: l10n.t('Email'),
            contextValue: EmailItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("account", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        if (await this.hasVerifiedCredentials()) {
            return [
                new SnapshotsItem(this.email),
                new AccountsItem(this.email),
                new HoldingsItem(this.email),
                new BenchmarksItem(this.email),
                new SettingsItem(this.email),
            ];
        } else {
            return [
                new GenericItem({
                    id: `/emails/${this.email}/refreshLogin`,
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

    private async hasVerifiedCredentials(): Promise<boolean> {
        const response: GetUserByToken = await getUserByToken(nonNullValue(await getAuthToken(this.email)));
        return response.error ? false : true;
    }
}