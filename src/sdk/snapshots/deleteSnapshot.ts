import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { DeleteSnapshotResponse } from "../portfolio-instruments-api";

export async function deleteSnapshot(token: string, snapshotId: number): Promise<DeleteSnapshotResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteSnapshotResponse;
}