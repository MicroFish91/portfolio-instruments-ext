import { l10n } from "vscode";
import { PromptStep } from "../../wizard/PromptStep";
import { PiQuickPickItem } from "../../wizard/UserInterface";
import { AuthContext } from "../AuthContext";
import { capitalize } from "../../utils/textUtils";
import { BenchmarksItem } from "../../tree/benchmarks/BenchmarksItem";
import { Benchmark } from "../../sdk/portfolio-instruments-api";

export type BenchmarkTargetStepOptions = {
    currentId?: number;
    suppressSkip?: boolean;
};

export class BenchmarkListStep<T extends AuthContext & { benchmarkId?: number }> extends PromptStep<T> {
    constructor(readonly options?: BenchmarkTargetStepOptions) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.benchmarkId = (await context.ui.showQuickPick(await this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Select a target benchmark'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkId;
    }

    private async getPicks(context: T): Promise<PiQuickPickItem<number | undefined>[]> {
        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarksWithCache(context.email);
        if (!benchmarks.length) {
            throw new Error(l10n.t('No benchmarks found, create a benchmark first to proceed'));
        }

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