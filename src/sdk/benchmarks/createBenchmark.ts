import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { CreateBenchmarkPayload, CreateBenchmarkResponse } from "../portfolio-instruments-api";

export async function createBenchmark(token: string, payload: CreateBenchmarkPayload): Promise<CreateBenchmarkResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/benchmarks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateBenchmarkResponse;
}