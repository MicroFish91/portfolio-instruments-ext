import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { HoldingsItem } from "./HoldingsItem";
import { createContextValue } from "../../utils/contextUtils";
import { reorderableContext, viewPropertiesContext } from "../../constants";
import { Reorderable } from "../reorder";
import { Holding } from "../../sdk/portfolio-instruments-api";

export class HoldingItem extends TreeItem implements PiExtTreeItem, Reorderable {
    static readonly contextValue: string = 'holdingItem';
    static readonly regExp: RegExp = new RegExp(HoldingItem.contextValue);

    id: string;
    kind = 'holding';
    contextValue: string;

    constructor(
        readonly parent: HoldingsItem,
        readonly email: string,
        readonly holding: Holding,
    ) {
        super(holding.name);
        this.id = `/users/${email}/holdings/${holding.holding_id}`;
        this.contextValue = createContextValue([HoldingItem.contextValue, reorderableContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: this.holding.asset_category,
            contextValue: this.contextValue,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    viewProperties(): string {
        return JSON.stringify(this.holding, undefined, 4);
    }

    getResourceId(): string {
        return this.holding.holding_id.toString();
    }
}