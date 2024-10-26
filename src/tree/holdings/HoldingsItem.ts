import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { Holding } from "../../sdk/types/holdings";
import { getHoldings } from "../../sdk/holdings/getHoldings";
import { HoldingItem } from "./HoldingItem";
import { viewPropertiesContext } from "../../constants";
import { createContextValue } from "../../utils/contextUtils";

export class HoldingsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'holdingsItem';
    static readonly regExp: RegExp = new RegExp(HoldingsItem.contextValue);

    id: string;

    constructor(readonly email: string) {
        super(l10n.t('Holdings'));
        this.id = `/emails/${email}/holdings`;
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
        return holdings.map(h => new HoldingItem(this, this.email, h));
    }

    static async getHoldings(email: string): Promise<Holding[]> {
        const response = await getHoldings(nonNullValue(await getAuthToken(email)));
        return response.data?.holdings ?? [];
    }

    async viewProperties(): Promise<string> {
        const holdings: Holding[] = await HoldingsItem.getHoldings(this.email);
        return JSON.stringify(holdings, undefined, 4);
    }
}