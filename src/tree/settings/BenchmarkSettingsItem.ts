import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Settings } from "../../sdk/types/settings";
import { SettingsItem } from "./SettingsItem";

export class BenchmarkSettingsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'benchmarkSettingsItem';
    static readonly regExp: RegExp = new RegExp(BenchmarkSettingsItem.contextValue);

    constructor(
        readonly parent: SettingsItem,
        readonly email: string,
        readonly settings: Settings,
        readonly benchmarkName: string,
    ) {
        super(`Benchmark target=${benchmarkName}`);
        this.id = `/users/${this.email}/settings/benchmark`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: BenchmarkSettingsItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("settings", "white"),
        };
    }
}