import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { CreateSnapshotValuePayload, CreateSnapshotValueResponse } from "../portfolio-instruments-api";

export async function createSnapshotValue(token: string, snapshotId: number, payload: CreateSnapshotValuePayload): Promise<CreateSnapshotValueResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}/values`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateSnapshotValueResponse;
}