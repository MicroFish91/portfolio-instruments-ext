import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { UpdateBenchmarkPayload, UpdateBenchmarkResponse } from "../portfolio-instruments-api";

export async function updateBenchmark(token: string, benchmarkId: number, payload: UpdateBenchmarkPayload): Promise<UpdateBenchmarkResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/benchmarks/${benchmarkId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateBenchmarkResponse;
}