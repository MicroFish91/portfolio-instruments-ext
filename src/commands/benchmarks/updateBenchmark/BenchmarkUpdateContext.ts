import { Benchmark } from "../../../sdk/types/benchmarks";
import { BenchmarkCreateContext } from "../createBenchmark/BenchmarkCreateContext";

export type BenchmarkUpdateContext = BenchmarkCreateContext & {
    benchmark: Benchmark;
    updatedBenchmark?: Benchmark;
};
