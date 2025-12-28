import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetBenchmarksResponse } from "../portfolio-instruments-api";

export async function getBenchmarks(token: string): Promise<GetBenchmarksResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/benchmarks`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetBenchmarksResponse;
}