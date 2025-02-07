import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { Holding } from "../../sdk/types/holdings";
import { getHoldings } from "../../sdk/holdings/getHoldings";
import { HoldingItem } from "./HoldingItem";
import { orderKeyPrefix, reordererContext, viewPropertiesContext } from "../../constants";
import { createContextValue } from "../../utils/contextUtils";
import { ext } from "../../extensionVariables";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds, Reorderer } from "../reorder";

export class HoldingsItem extends TreeItem implements PiExtTreeItem, Reorderer {
    static readonly contextValue: string = 'holdingsItem';
    static readonly regExp: RegExp = new RegExp(HoldingsItem.contextValue);

    id: string;
    kind = 'holdings';
    private refreshedChildOrder: boolean = false;

    constructor(readonly email: string) {
        super(l10n.t('Holdings'));
        this.id = `/users/${email}/holdings`;
        this.contextValue = createContextValue([HoldingsItem.contextValue, reordererContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        let holdings: Holding[];
        if (this.refreshedChildOrder) {
            // We generally want to refresh the cache
            // However, if we know the node was refreshed due to having been reordered, no need to re-fetch
            holdings = await HoldingsItem.getHoldingsWithCache(this.email);
            this.refreshedChildOrder = false;
        } else {
            holdings = await HoldingsItem.getHoldings(this.email);
        }

        const orderedHoldings: Holding[] = await this.getOrderedResourceModels(holdings);
        ext.resourceCache.set(HoldingsItem.generatePiExtHoldingsId(this.email), orderedHoldings);

        return orderedHoldings.map(h => new HoldingItem(this, this.email, h));
    }

    canReorderItem(item: PiExtTreeItem): boolean {
        return !!item?.contextValue?.includes(HoldingItem.contextValue);
    }

    async getOrderedResourceModels(holdings?: Holding[]): Promise<(Holding & GenericPiResourceModel)[]> {
        holdings ??= await HoldingsItem.getHoldingsWithCache(this.email);
        holdings = holdings.filter(h => !h.is_deprecated);

        const holdingResourceModels: (Holding & GenericPiResourceModel)[] = holdings.map(h => convertToGenericPiResourceModel(h, 'holding_id'));
        const orderedResourceIds: string[] = ext.context.globalState.get<string[]>(HoldingsItem.generatePiExtHoldingsOrderId(this.email)) ?? [];

        return orderResourcesByTargetIds(holdingResourceModels, orderedResourceIds);
    }

    async reorderChildrenByTargetResourceModelIds(ids: string[]): Promise<void> {
        this.refreshedChildOrder = true;
        await ext.context.globalState.update(HoldingsItem.generatePiExtHoldingsOrderId(this.email), ids);
        ext.portfolioInstrumentsTdp.refresh(this);
    }

    async viewProperties(): Promise<string> {
        const holdings: Holding[] = await HoldingsItem.getHoldingsWithCache(this.email);
        return JSON.stringify(holdings, undefined, 4);
    }

    static async getHoldings(email: string): Promise<Holding[]> {
        const response = await getHoldings(nonNullValue(await getAuthToken(email)));
        return response.data?.holdings ?? [];
    }

    static async getHoldingsWithCache(email: string): Promise<Holding[]> {
        const cachedHoldings: Holding[] | undefined = ext.resourceCache.get(HoldingsItem.generatePiExtHoldingsId(email));
        const holdings: Holding[] = cachedHoldings ?? await HoldingsItem.getHoldings(email);

        if (!cachedHoldings) {
            ext.resourceCache.set(HoldingsItem.generatePiExtHoldingsId(email), holdings);
        }

        return holdings;
    }

    static generatePiExtHoldingsId(email: string): string {
        return `/users/${email}/holdings`;
    }

    static generatePiExtHoldingsOrderId(email: string): string {
        return orderKeyPrefix + HoldingsItem.generatePiExtHoldingsId(email);
    }
}