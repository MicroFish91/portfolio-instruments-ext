import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { BenchmarksItem } from "./BenchmarksItem";
import { Benchmark } from "../../sdk/types/benchmarks";

export class BenchmarkItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'benchmarkItem';
    static readonly regExp: RegExp = new RegExp(BenchmarkItem.contextValue);

    id: string;

    constructor(
        readonly parent: BenchmarksItem,
        readonly email: string,
        readonly benchmark: Benchmark,
    ) {
        super(benchmark.name);
        this.id = `/users/${email}/benchmarks/${benchmark.benchmark_id}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: this.benchmark.asset_allocation.map(a => a.percent).sort((a, b) => b - a).join('% / ') + '%',
            contextValue: this.getContextValue(),
            iconPath: new ThemeIcon('pie-chart', 'white'),
        };
    }

    private getContextValue(): string {
        return createContextValue([BenchmarkItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        return JSON.stringify(this.benchmark, undefined, 4);
    }
}