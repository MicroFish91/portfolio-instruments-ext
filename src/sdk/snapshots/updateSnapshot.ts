import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { UpdateSnapshotPayload, UpdateSnapshotResponse } from "../portfolio-instruments-api";

export async function updateSnapshot(token: string, snapshotId: number, payload: UpdateSnapshotPayload): Promise<UpdateSnapshotResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateSnapshotResponse;
}