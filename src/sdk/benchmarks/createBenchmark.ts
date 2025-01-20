import { settingUtils } from "../../utils/settingUtils";
import { AssetAllocationPct, Benchmark } from "../types/benchmarks";

export type CreateBenchmarkPayload = {
    name: string;
    description?: string;
    asset_allocation: AssetAllocationPct[];
    std_dev_pct?: number;
    real_return_pct?: number;
    drawdown_yrs?: number;
    is_deprecated?: boolean;
};

export type CreateBenchmarkApiResponse = {
    status: number;
    data?: {
        benchmark: Benchmark;
    };
    error?: string;
};

export async function createBenchmark(token: string, payload: CreateBenchmarkPayload): Promise<CreateBenchmarkApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/benchmarks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateBenchmarkApiResponse;
}