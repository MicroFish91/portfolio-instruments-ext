import { AssetCategory, Benchmark } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

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
