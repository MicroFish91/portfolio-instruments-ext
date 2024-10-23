import { l10n, Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";
import { createBenchmark, CreateBenchmarkApiResponse } from "../../../sdk/benchmarks/createBenchmark";
import { nonNullProp } from "../../../utils/nonNull";
import { AssetAllocationPct } from "../../../sdk/types/benchmarks";
import { AssetCategory } from "../../../sdk/types/holdings";

export class BenchmarkCreateStep<T extends BenchmarkCreateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating benchmark..." });

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

        const response: CreateBenchmarkApiResponse = await createBenchmark(context.token, {
            name: nonNullProp(context, 'benchmarkName'),
            description: context.benchmarkDescription,
            asset_allocation: assetAllocation,
            real_return_pct: context.benchmarkRealReturn,
            std_dev_pct: context.benchmarkStdDev,
            drawdown_yrs: context.benchmarkDrawdownYears,
            is_deprecated: false,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.benchmark = response.data?.benchmark;
    }

    shouldExecute(context: T): boolean {
        return !context.benchmark;
    }
}
