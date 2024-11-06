import { AssetAllocationPct, Benchmark } from "../types/benchmarks";

export type UpdateBenchmarkPayload = {
    name: string;
    description?: string;
    asset_allocation: AssetAllocationPct[];
    std_dev_pct?: number;
    real_return_pct?: number;
    drawdown_yrs?: number;
    is_deprecated?: boolean;
};

export type UpdateBenchmarkApiResponse = {
    status: number;
    data?: {
        benchmark: Benchmark;
    };
    error?: string;
};

export async function updateBenchmark(token: string, benchmarkId: number, payload: UpdateBenchmarkPayload): Promise<UpdateBenchmarkApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/benchmarks/${benchmarkId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateBenchmarkApiResponse;
}