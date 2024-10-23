import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { BenchmarkDeleteContext } from "./BenchmarkDeleteContext";
import { deleteBenchmark, DeleteBenchmarkApiResponse } from "../../../sdk/benchmarks/deleteBenchmark";

export class BenchmarkDeleteStep<T extends BenchmarkDeleteContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>): Promise<void> {
        progress.report({ message: l10n.t("Deleting benchmark...") });

        const response: DeleteBenchmarkApiResponse = await deleteBenchmark(nonNullProp(context, 'token'), context.benchmark.benchmark_id);
        if (response.error) {
            throw new Error(response.error);
        }
    }

    shouldExecute(context: T): boolean {
        return !!context.benchmark;
    }
}
