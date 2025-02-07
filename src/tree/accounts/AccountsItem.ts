import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAccounts } from "../../sdk/accounts/getAccounts";
import { Account } from "../../sdk/types/accounts";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { AccountItem } from "./AccountItem";
import { createContextValue } from "../../utils/contextUtils";
import { orderKeyPrefix, reordererContext, viewPropertiesContext } from "../../constants";
import { ext } from "../../extensionVariables";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds, Reorderer } from "../reorder";

export class AccountsItem extends TreeItem implements PiExtTreeItem, Reorderer {
    static readonly contextValue: string = 'accountsItem';
    static readonly regExp: RegExp = new RegExp(AccountsItem.contextValue);

    id: string;
    kind = 'accounts';
    private refreshedChildOrder: boolean = false;

    constructor(readonly email: string) {
        super(l10n.t('Accounts'));
        this.id = `/users/${email}/accounts`;
        this.contextValue = createContextValue([AccountsItem.contextValue, reordererContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon('home', 'white'),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        let accounts: Account[];
        if (this.refreshedChildOrder) {
            // We generally want to refresh the cache
            // However, if we know the node was refreshed due to having been reordered, no need to re-fetch
            accounts = await AccountsItem.getAccountsWithCache(this.email);
            this.refreshedChildOrder = false;
        } else {
            accounts = await AccountsItem.getAccounts(this.email);
        }

        const orderedAccounts: Account[] = await this.getOrderedResourceModels(accounts);
        ext.resourceCache.set(AccountsItem.generatePiExtAccountsId(this.email), orderedAccounts);

        return orderedAccounts.map(a => new AccountItem(this, this.email, a));
    }

    canReorderItem(item: PiExtTreeItem): boolean {
        return !!item?.contextValue?.includes(AccountItem.contextValue);
    }

    async getOrderedResourceModels(accounts?: Account[]): Promise<(Account & GenericPiResourceModel)[]> {
        accounts ??= await AccountsItem.getAccountsWithCache(this.email);
        accounts = accounts.filter(a => !a.is_deprecated);

        const accountResourceModels: (Account & GenericPiResourceModel)[] = accounts.map(a => convertToGenericPiResourceModel(a, 'account_id'));
        const orderedResourceIds: string[] = ext.context.globalState.get<string[]>(AccountsItem.generatePiExtAccountsOrderId(this.email)) ?? [];

        return orderResourcesByTargetIds(accountResourceModels, orderedResourceIds);
    }

    async reorderChildrenByTargetResourceModelIds(ids: string[]): Promise<void> {
        this.refreshedChildOrder = true;
        await ext.context.globalState.update(AccountsItem.generatePiExtAccountsOrderId(this.email), ids);
        ext.portfolioInstrumentsTdp.refresh(this);
    }

    async viewProperties(): Promise<string> {
        const accounts: Account[] = await AccountsItem.getAccountsWithCache(this.email);
        return JSON.stringify(accounts, undefined, 4);
    }

    static async getAccounts(email: string): Promise<Account[]> {
        const response = await getAccounts(nonNullValue(await getAuthToken(email)));
        return response.data?.accounts ?? [];
    }

    static async getAccountsWithCache(email: string): Promise<Account[]> {
        const cachedAccounts: Account[] | undefined = ext.resourceCache.get(AccountsItem.generatePiExtAccountsId(email));
        const accounts: Account[] = cachedAccounts ?? await AccountsItem.getAccounts(email);

        if (!cachedAccounts) {
            ext.resourceCache.set(AccountsItem.generatePiExtAccountsId(email), accounts);
        }

        return accounts;
    }

    static generatePiExtAccountsId(email: string): string {
        return `/users/${email}/accounts/`;
    }

    static generatePiExtAccountsOrderId(email: string): string {
        return orderKeyPrefix + AccountsItem.generatePiExtAccountsId(email);
    }
}