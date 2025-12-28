import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotResponse, GetSnapshotsResponse } from "../portfolio-instruments-api";
import { getSnapshotsLatest } from "./getSnapshots";

export async function getSnapshot(token: string, snapshotId: number): Promise<GetSnapshotResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotResponse;
}

export async function getSnapshotLatest(token: string): Promise<GetSnapshotResponse> {
    const snapshotsResponse: GetSnapshotsResponse = await getSnapshotsLatest(token);
    if (snapshotsResponse.error) {
        return {
            status: snapshotsResponse.status,
            data: undefined,
            error: snapshotsResponse.error,
        };
    }
    return await getSnapshot(token, snapshotsResponse.data?.snapshots?.[0].snap_id ?? 0);
}