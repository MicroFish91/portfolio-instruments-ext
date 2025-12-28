import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { DeleteSnapshotValueResponse } from "../portfolio-instruments-api";

export async function deleteSnapshotValue(token: string, snapshotId: number, snapshotValueId: number): Promise<DeleteSnapshotValueResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}/values/${snapshotValueId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteSnapshotValueResponse;
}