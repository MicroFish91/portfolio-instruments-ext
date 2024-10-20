import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { AccountsItem } from "../accounts/AccountsItem";
import { GetUserByToken, getUserByToken } from "../../sdk/auth/getUserByToken";
import { nonNullValue } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { GenericItem } from "../GenericItem";

export class EmailItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'emailItem';
    static readonly regExp: RegExp = new RegExp(EmailItem.contextValue);

    readonly email: string;

    constructor(email: string) {
        super(email);
        this.email = email;
    }

    async getTreeItem(): Promise<TreeItem> {
        return {
            id: `/email/${this.label}`,
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
                new AccountsItem(this.email),
            ];
        } else {
            return [
                new GenericItem({
                    id: `/emails/${this.email}/login`,
                    label: l10n.t('Credentials are stale, login again to proceed.'),
                    contextValue: 'emailLoginItem',
                    command: {
                        title: 'Login to existing email',
                        command: 'portfolioInstruments.loginExisting',
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