import { AuthContext } from "../../AuthContext";
import { Benchmark } from "../../../sdk/types/benchmarks";
import { AssetCategory } from "../../../sdk/types/holdings";

export type BenchmarkCreateContext = AuthContext & {
    benchmarkName?: string;
    benchmarkDescription?: string;
    benchmarkAssets?: AssetCategory[];
    benchmarkAssetAmounts?: number[];
    benchmarkRealReturn?: number;
    benchmarkStdDev?: number;
    benchmarkDrawdownYears?: number;

    benchmark?: Benchmark;
};
