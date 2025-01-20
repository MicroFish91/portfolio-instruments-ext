import { settingUtils } from "../../utils/settingUtils";
import { Snapshot, SnapshotValue } from "../types/snapshots";

export type CreateSnapshotPayload = {
    snap_date: string;
    description?: string;
    snapshot_values: CreateSnapshotValuePayload[];
    benchmark_id?: number;
};

export type CreateSnapshotValuePayload = {
    account_id: number;
    holding_id: number;
    total: number;
    skip_rebalance?: boolean;
};

export type CreateSnapshotApiResponse = {
    status: number;
    data?: {
        snapshot: Snapshot;
        snapshot_values: SnapshotValue[];
    };
    error?: string;
};

export async function createSnapshot(token: string, payload: CreateSnapshotPayload): Promise<CreateSnapshotApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateSnapshotApiResponse;
}