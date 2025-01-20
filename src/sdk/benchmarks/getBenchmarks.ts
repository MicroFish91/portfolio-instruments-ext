import { settingUtils } from "../../utils/settingUtils";
import { Benchmark } from "../types/benchmarks";
import { PaginationMetadata } from "../types/pagination";

export type GetBenchmarksApiResponse = {
    status: number;
    data?: {
        benchmarks: Benchmark[];
        pagination: PaginationMetadata;
    };
    error?: string;
};

export async function getBenchmarks(token: string): Promise<GetBenchmarksApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/benchmarks`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetBenchmarksApiResponse;
}