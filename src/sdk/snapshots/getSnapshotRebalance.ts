import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotRebalanceResponse } from "../portfolio-instruments-api";

export async function getSnapshotRebalance(token: string, snapshotId: number): Promise<GetSnapshotRebalanceResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}/rebalance`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotRebalanceResponse;
}