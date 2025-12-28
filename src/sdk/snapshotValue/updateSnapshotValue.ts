import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { UpdateSnapshotValuePayload, UpdateSnapshotValueResponse } from "../portfolio-instruments-api";

export async function updateSnapshotValue(token: string, snapshotId: number, snapshotValueId: number, payload: UpdateSnapshotValuePayload): Promise<UpdateSnapshotValueResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}/values/${snapshotValueId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateSnapshotValueResponse;
}