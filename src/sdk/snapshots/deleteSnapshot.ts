import { settingUtils } from "../../utils/settingUtils";
import { Snapshot } from "../types/snapshots";

export type DeleteSnapshotApiResponse = {
    status: number;
    data?: {
        message: string;
        snapshot: Snapshot;
    };
    error?: string;
};

export async function deleteSnapshot(token: string, snapshotId: number): Promise<DeleteSnapshotApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots/${snapshotId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteSnapshotApiResponse;
}