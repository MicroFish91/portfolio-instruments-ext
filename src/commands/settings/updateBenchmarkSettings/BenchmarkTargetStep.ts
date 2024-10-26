import { PromptStep } from "../../../wizard/PromptStep";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { BenchmarkSettingsUpdateContext } from "./BenchmarkSettingsUpdateContext";
import { getBenchmarks, GetBenchmarksApiResponse } from "../../../sdk/benchmarks/getBenchmarks";
import { Benchmark } from "../../../sdk/types/benchmarks";
import { capitalize } from "../../../utils/textUtils";
import { nonNullValueAndProp } from "../../../utils/nonNull";

export class BenchmarkTargetStep<T extends BenchmarkSettingsUpdateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.benchmarkId = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Select a target benchmark'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkId;
    }

    private async getPicks(context: T): Promise<PiQuickPickItem<number>[]> {
        const response: GetBenchmarksApiResponse = await getBenchmarks(context.token);
        if (response.error) {
            throw new Error(l10n.t('No target benchmarks available. You must create a benchmark first before trying to assign a target.'));
        }

        const benchmarks: Benchmark[] = nonNullValueAndProp(response.data, 'benchmarks');
        return benchmarks.map(benchmark => {
            return {
                label: benchmark.name,
                detail: benchmark.asset_allocation.map(a => `${capitalize(a.category)} - ${a.percent}%`).join(', '),
                data: benchmark.benchmark_id,
            };
        });
    }
}