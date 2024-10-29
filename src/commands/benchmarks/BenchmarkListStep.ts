import { l10n } from "vscode";
import { getBenchmarks, GetBenchmarksApiResponse } from "../../sdk/benchmarks/getBenchmarks";
import { Settings } from "../../sdk/types/settings";
import { PromptStep } from "../../wizard/PromptStep";
import { PiQuickPickItem } from "../../wizard/UserInterface";
import { AuthContext } from "../AuthContext";
import { Benchmark } from "../../sdk/types/benchmarks";
import { nonNullValueAndProp } from "../../utils/nonNull";
import { capitalize } from "../../utils/textUtils";

export type BenchmarkTargetStepOptions = {
    currentId?: number;
    suppressSkip?: boolean;
};

export class BenchmarkListStep<T extends AuthContext & { settings?: Settings; benchmarkId?: number }> extends PromptStep<T> {
    constructor(readonly options?: BenchmarkTargetStepOptions) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.benchmarkId = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Select a target benchmark'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkId;
    }

    private async getPicks(context: T): Promise<PiQuickPickItem<number | undefined>[]> {
        const response: GetBenchmarksApiResponse = await getBenchmarks(context.token);
        if (response.error) {
            throw new Error(l10n.t('No target benchmarks available - please create a benchmark first.'));
        }

        const benchmarks: Benchmark[] = nonNullValueAndProp(response.data, 'benchmarks');
        const picks: PiQuickPickItem<number | undefined>[] = benchmarks.map(benchmark => {
            const isDefault: boolean = this.options?.currentId === benchmark.benchmark_id;
            return {
                label: benchmark.name,
                description: isDefault ? l10n.t('(current)') : undefined,
                detail: benchmark.asset_allocation.map(a => `${capitalize(a.category)} - ${a.percent}%`).join(', '),
                data: benchmark.benchmark_id,
            };
        });

        if (!this.options?.suppressSkip) {
            picks.push({
                label: l10n.t('Skip for now'),
                data: undefined,
            });
        }
        return picks;
    }
}