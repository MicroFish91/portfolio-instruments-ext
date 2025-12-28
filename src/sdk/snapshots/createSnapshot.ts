import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { CreateSnapshotPayload, CreateSnapshotResponse } from "../portfolio-instruments-api";

export async function createSnapshot(token: string, payload: CreateSnapshotPayload): Promise<CreateSnapshotResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateSnapshotResponse;
}