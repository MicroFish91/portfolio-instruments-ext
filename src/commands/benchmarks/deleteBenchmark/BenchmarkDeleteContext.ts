import { Benchmark } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type BenchmarkDeleteContext = AuthContext & {
    benchmark: Benchmark;
};