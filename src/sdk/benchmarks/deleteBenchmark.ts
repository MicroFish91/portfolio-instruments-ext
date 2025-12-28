import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { DeleteBenchmarkResponse } from "../portfolio-instruments-api";

export async function deleteBenchmark(token: string, benchmarkId: number): Promise<DeleteBenchmarkResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/benchmarks/${benchmarkId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteBenchmarkResponse;
}