import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { getAuthToken } from "../../utils/tokenUtils";
import { nonNullValue } from "../../utils/nonNull";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { getBenchmarks } from "../../sdk/benchmarks/getBenchmarks";
import { Benchmark } from "../../sdk/types/benchmarks";
import { BenchmarkItem } from "./BenchmarkItem";

export class BenchmarksItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'benchmarksItem';
    static readonly regExp: RegExp = new RegExp(BenchmarksItem.contextValue);

    id: string;

    constructor(readonly email: string) {
        super(l10n.t('Benchmarks'));
        this.id = `/emails/${email}/benchmarks`;
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
        return benchmarks.map(b => new BenchmarkItem(this, this.email, b));
    }

    static async getBenchmarks(email: string): Promise<Benchmark[]> {
        const response = await getBenchmarks(nonNullValue(await getAuthToken(email)));
        return response.data?.benchmarks ?? [];
    }

    private getContextValue(): string {
        return createContextValue([BenchmarksItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarks(this.email);
        return JSON.stringify(benchmarks, undefined, 4);
    }
}