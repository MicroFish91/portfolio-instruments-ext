import { AssetCategory } from "./holdings";

export type Benchmark = {
    benchmark_id: number;
    name: string;
    description?: string;
    asset_allocation: AssetAllocationPct[];
    std_dev_pct?: number;
    real_return_pct?: number;
    drawdown_yrs?: number;
    is_deprecated: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
};

export type AssetAllocationPct = {
    category: AssetCategory;
    percent: number;
}