import { Benchmark } from "../../../sdk/portfolio-instruments-api";
import { BenchmarkCreateContext } from "../createBenchmark/BenchmarkCreateContext";

export type BenchmarkUpdateContext = BenchmarkCreateContext & {
    benchmark: Benchmark;
    updatedBenchmark?: Benchmark;
};
