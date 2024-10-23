import { AuthContext } from "../../AuthContext";
import { Benchmark } from "../../../sdk/types/benchmarks";

export type BenchmarkDeleteContext = AuthContext & {
    benchmark: Benchmark;
};