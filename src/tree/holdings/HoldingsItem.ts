import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState, workspace } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { getHoldings } from "../../sdk/holdings/getHoldings";
import { HoldingItem } from "./HoldingItem";
import { HoldingDeprecatedItem } from "./HoldingDeprecatedItem";
import { orderKeyPrefix, reordererContext, viewPropertiesContext } from "../../constants";
import { createContextValue } from "../../utils/contextUtils";
import { ext } from "../../extensionVariables";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds, Reorderer } from "../reorder";
import { Holding } from "../../sdk/portfolio-instruments-api";

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

        const showDeprecated = workspace.getConfiguration('portfolioInstruments').get<boolean>('showDeprecatedResources', false);
        
        // Separate deprecated and non-deprecated holdings
        const nonDeprecatedHoldings = holdings.filter(h => !h.is_deprecated);
        const deprecatedHoldings = showDeprecated ? holdings.filter(h => h.is_deprecated) : [];

        const orderedHoldings: Holding[] = await this.getOrderedResourceModels(nonDeprecatedHoldings);
        ext.resourceCache.set(HoldingsItem.generatePiExtHoldingsId(this.email), orderedHoldings);

        const items: PiExtTreeItem[] = orderedHoldings.map(h => new HoldingItem(this, this.email, h));
        
        // Add deprecated holdings at the end
        if (deprecatedHoldings.length > 0) {
            items.push(...deprecatedHoldings.map(h => new HoldingDeprecatedItem(this, this.email, h)));
        }

        return items;
    }

    canReorderItem(item: PiExtTreeItem): boolean {
        return !!item.contextValue?.includes(HoldingItem.contextValue);
    }

    async getOrderedResourceModels(holdings?: Holding[]): Promise<(Holding & GenericPiResourceModel)[]> {
        holdings ??= await HoldingsItem.getHoldingsWithCache(this.email);

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