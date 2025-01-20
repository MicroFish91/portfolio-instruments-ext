import { settingUtils } from "../../utils/settingUtils";
import { SnapshotValue } from "../types/snapshots";

export type DeleteSnapshotValueApiResponse = {
    status: number;
    data?: {
        message: string;
        snapshot_value: SnapshotValue;
        snapshot_total: number;
        snapshot_weighteder: number;
    };
    error?: string;
};

export async function deleteSnapshotValue(token: string, snapshotId: number, snapshotValueId: number): Promise<DeleteSnapshotValueApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots/${snapshotId}/values/${snapshotValueId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteSnapshotValueApiResponse;
}