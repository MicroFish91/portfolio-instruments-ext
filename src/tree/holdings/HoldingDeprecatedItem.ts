import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { HoldingsItem } from "./HoldingsItem";
import { Holding } from "../../sdk/portfolio-instruments-api";

export class HoldingDeprecatedItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'holdingDeprecatedItem';
    static readonly regExp: RegExp = new RegExp(HoldingDeprecatedItem.contextValue);

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
        this.contextValue = createContextValue([HoldingDeprecatedItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `${this.holding.asset_category} ${l10n.t('(deprecated)')}`,
            contextValue: this.contextValue,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    viewProperties(): string {
        return JSON.stringify(this.holding, undefined, 4);
    }
}
