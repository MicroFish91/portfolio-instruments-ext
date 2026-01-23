import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { BenchmarksItem } from "./BenchmarksItem";
import { Benchmark } from "../../sdk/portfolio-instruments-api";

export class BenchmarkDeprecatedItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'benchmarkDeprecatedItem';
    static readonly regExp: RegExp = new RegExp(BenchmarkDeprecatedItem.contextValue);

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
            description: l10n.t('deprecated'),
            contextValue: this.getContextValue(),
            iconPath: new ThemeIcon('pie-chart', 'white'),
        };
    }

    private getContextValue(): string {
        return createContextValue([BenchmarkDeprecatedItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        return JSON.stringify(this.benchmark, undefined, 4);
    }
}
