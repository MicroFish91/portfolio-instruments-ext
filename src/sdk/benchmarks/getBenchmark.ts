import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetBenchmarkResponse } from "../portfolio-instruments-api";

export async function getBenchmark(token: string, benchmarkId: number): Promise<GetBenchmarkResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/benchmarks/${benchmarkId}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetBenchmarkResponse;
}