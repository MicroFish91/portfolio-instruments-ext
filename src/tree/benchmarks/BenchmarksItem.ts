import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState, workspace } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { getBenchmarks } from "../../sdk/benchmarks/getBenchmarks";
import { BenchmarkItem } from "./BenchmarkItem";
import { BenchmarkDeprecatedItem } from "./BenchmarkDeprecatedItem";
import { ext } from "../../extensionVariables";
import { Benchmark } from "../../sdk/portfolio-instruments-api";

export class BenchmarksItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'benchmarksItem';
    static readonly regExp: RegExp = new RegExp(BenchmarksItem.contextValue);

    id: string;

    constructor(readonly email: string) {
        super(l10n.t('Benchmarks'));
        this.id = `/users/${email}/benchmarks`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon('pie-chart', 'white'),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarks(this.email);
        ext.resourceCache.set(BenchmarksItem.generatePiExtBenchmarksId(this.email), benchmarks);
        
        const showDeprecated = workspace.getConfiguration('portfolioInstruments').get<boolean>('showDeprecatedResources', false);
        
        // Separate deprecated and non-deprecated benchmarks
        const nonDeprecatedBenchmarks = benchmarks.filter(b => !b.is_deprecated);
        const deprecatedBenchmarks = showDeprecated ? benchmarks.filter(b => b.is_deprecated) : [];
        
        const items: PiExtTreeItem[] = nonDeprecatedBenchmarks.map(b => new BenchmarkItem(this, this.email, b));
        
        // Add deprecated benchmarks at the end
        if (deprecatedBenchmarks.length > 0) {
            items.push(...deprecatedBenchmarks.map(b => new BenchmarkDeprecatedItem(this, this.email, b)));
        }
        
        return items;
    }

    private getContextValue(): string {
        return createContextValue([BenchmarksItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarksWithCache(this.email);
        return JSON.stringify(benchmarks, undefined, 4);
    }

    static async getBenchmarks(email: string): Promise<Benchmark[]> {
        const response = await getBenchmarks(nonNullValue(await getAuthToken(email)));
        return response.data?.benchmarks ?? [];
    }

    static async getBenchmarksWithCache(email: string): Promise<Benchmark[]> {
        const cachedBenchmarks: Benchmark[] | undefined = ext.resourceCache.get(BenchmarksItem.generatePiExtBenchmarksId(email));
        const benchmarks: Benchmark[] = cachedBenchmarks ?? await BenchmarksItem.getBenchmarks(email);

        if (!cachedBenchmarks) {
            ext.resourceCache.set(BenchmarksItem.generatePiExtBenchmarksId(email), benchmarks);
        }

        return benchmarks;
    }

    static generatePiExtBenchmarksId(email: string): string {
        return `/users/${email}/benchmarks`;
    }
}