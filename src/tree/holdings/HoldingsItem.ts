import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { Holding } from "../../sdk/types/holdings";
import { getHoldings } from "../../sdk/holdings/getHoldings";
import { HoldingItem } from "./HoldingItem";
import { viewPropertiesContext } from "../../constants";
import { createContextValue } from "../../utils/contextUtils";
import { ext } from "../../extensionVariables";

export class HoldingsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'holdingsItem';
    static readonly regExp: RegExp = new RegExp(HoldingsItem.contextValue);

    id: string;

    constructor(readonly email: string) {
        super(l10n.t('Holdings'));
        this.id = `/users/${email}/holdings`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    private getContextValue(): string {
        return createContextValue([HoldingsItem.contextValue, viewPropertiesContext]);
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const holdings: Holding[] = await HoldingsItem.getHoldings(this.email);
        ext.resourceCache.set(HoldingsItem.generatePiExtHoldingsId(this.email), holdings);
        return holdings
            .filter(h => !h.is_deprecated)
            .map(h => new HoldingItem(this, this.email, h));
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
}