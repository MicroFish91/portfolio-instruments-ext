import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { Benchmark } from "../../sdk/types/benchmarks";
import { BenchmarksItem } from "../benchmarks/BenchmarksItem";
import { BenchmarkSettingsItem } from "./BenchmarkSettingsItem";
import { RebalanceSettingsItem } from "./RebalanceSettingsItem";
import { EmailItem } from "../auth/EmailItem";
import { ext } from "../../extensionVariables";

export class SettingsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'settingsItem';
    static readonly regExp: RegExp = new RegExp(SettingsItem.contextValue);

    constructor(
        readonly email: string,
    ) {
        super(l10n.t('Settings'));
        this.id = `/emails/${email}/settings`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("gear", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const { settings } = await EmailItem.getUserAndSettings(this.email);
        ext.resourceCache.set(SettingsItem.generatePiExtSettingsId(this.email), settings);

        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarksWithCache(this.email);
        const benchmarksMap = new Map<number, Benchmark>();

        for (const benchmark of benchmarks) {
            benchmarksMap.set(benchmark.benchmark_id, benchmark);
        }

        return [
            new RebalanceSettingsItem(
                this,
                this.email,
                settings,
            ),
            new BenchmarkSettingsItem(
                this,
                this.email,
                settings,
                settings.benchmark_id ? String(benchmarksMap.get(settings.benchmark_id)?.name) : '',
            ),
        ];
    }

    private getContextValue(): string {
        return createContextValue([SettingsItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const { settings } = await EmailItem.getUserAndSettingsWithCache(this.email);
        return JSON.stringify(settings, undefined, 4);
    }

    static generatePiExtSettingsId(email: string): string {
        return `/settings/${email}`;
    }
}