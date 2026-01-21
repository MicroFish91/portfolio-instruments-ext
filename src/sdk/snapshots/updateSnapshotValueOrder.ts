import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { UpdateSnapshotValueOrderPayload, UpdateSnapshotValueOrderResponse } from "../portfolio-instruments-api";

export async function updateSnapshotValueOrder(token: string, snapshotId: number, payload: UpdateSnapshotValueOrderPayload): Promise<UpdateSnapshotValueOrderResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}/order`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateSnapshotValueOrderResponse;
}
