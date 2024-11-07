import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Holding } from "../../sdk/types/holdings";
import { HoldingsItem } from "./HoldingsItem";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";

export class HoldingItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'holdingItem';
    static readonly regExp: RegExp = new RegExp(HoldingItem.contextValue);

    id: string;

    constructor(
        readonly parent: HoldingsItem,
        readonly email: string,
        readonly holding: Holding,
    ) {
        super(holding.name);
        this.id = `/users/${email}/holdings/${holding.holding_id}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: this.holding.asset_category,
            contextValue: this.getContextValue(),
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    private getContextValue(): string {
        return createContextValue([HoldingItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.holding, undefined, 4);
    }
}