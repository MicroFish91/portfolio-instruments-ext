import { l10n, Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { CreateBenchmarkApiResponse } from "../../../sdk/benchmarks/createBenchmark";
import { nonNullProp } from "../../../utils/nonNull";
import { AssetAllocationPct } from "../../../sdk/types/benchmarks";
import { AssetCategory } from "../../../sdk/types/holdings";
import { BenchmarkUpdateContext } from "./BenchmarkUpdateContext";
import { updateBenchmark } from "../../../sdk/benchmarks/updateBenchmark";

export class BenchmarkUpdateStep<T extends BenchmarkUpdateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Updating benchmark..." });

        const benchmarkAssets: AssetCategory[] = nonNullProp(context, 'benchmarkAssets');
        const benchmarkAssetAmounts: number[] = nonNullProp(context, 'benchmarkAssetAmounts');
        if (benchmarkAssets.length !== benchmarkAssetAmounts.length) {
            throw new Error(l10n.t('Invalid benchmark asset allocation provided.'));
        }

        const assetAllocation: AssetAllocationPct[] = [];
        for (let i = 0; i < benchmarkAssets.length; i++) {
            assetAllocation.push({
                category: benchmarkAssets[i],
                percent: benchmarkAssetAmounts[i],
            });
        }

        const response: CreateBenchmarkApiResponse = await updateBenchmark(context.token, context.benchmark.benchmark_id, {
            name: nonNullProp(context, 'benchmarkName'),
            description: context.benchmarkDescription,
            asset_allocation: assetAllocation,
            real_return_pct: context.benchmarkRealReturn,
            std_dev_pct: context.benchmarkStdDev,
            drawdown_yrs: context.benchmarkDrawdownYears,
            is_deprecated: !!context.benchmark.is_deprecated,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.updatedBenchmark = response.data?.benchmark;
    }

    shouldExecute(context: T): boolean {
        return !context.updatedBenchmark;
    }
}
