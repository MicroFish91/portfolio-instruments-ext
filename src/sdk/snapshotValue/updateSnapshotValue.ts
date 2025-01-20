import { settingUtils } from "../../utils/settingUtils";
import { SnapshotValue } from "../types/snapshots";

export type UpdateSnapshotValuePayload = {
    account_id: number;
    holding_id: number;
    total: number;
    skip_rebalance?: boolean;
};

export type UpdateSnapshotValueApiResponse = {
    status: number;
    data?: {
        snapshot_value: SnapshotValue;
        snapshot_total: number;
        snapshot_weighteder: number;
    };
    error?: string;
};

export async function updateSnapshotValue(token: string, snapshotId: number, snapshotValueId: number, payload: UpdateSnapshotValuePayload): Promise<UpdateSnapshotValueApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots/${snapshotId}/values/${snapshotValueId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateSnapshotValueApiResponse;
}