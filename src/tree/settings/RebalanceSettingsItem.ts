import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Settings } from "../../sdk/types/settings";
import { SettingsItem } from "./SettingsItem";

export class RebalanceSettingsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'rebalanceSettingsItem';
    static readonly regExp: RegExp = new RegExp(RebalanceSettingsItem.contextValue);

    constructor(
        readonly parent: SettingsItem,
        readonly email: string,
        readonly settings: Settings,
    ) {
        super(l10n.t(`Rebalance threshold=${settings.reb_thresh_pct}%`));
        this.id = `/emails/${email}/settings/rebalanceThreshold`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: RebalanceSettingsItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("settings", "white"),
        };
    }
}