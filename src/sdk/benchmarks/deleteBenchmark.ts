import { settingUtils } from "../../utils/settingUtils";
import { Benchmark } from "../types/benchmarks";

export type DeleteBenchmarkApiResponse = {
    status: number;
    data?: {
        message: string;
        benchmark: Benchmark;
    };
    error?: string;
};

export async function deleteBenchmark(token: string, benchmarkId: number): Promise<DeleteBenchmarkApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/benchmarks/${benchmarkId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteBenchmarkApiResponse;
}