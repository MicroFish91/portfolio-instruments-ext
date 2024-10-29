import { SnapshotValue } from "../types/snapshots";

export type CreateSnapshotValuePayload = {
    account_id: number;
    holding_id: number;
    total: number;
    skip_rebalance?: boolean;
};

export type CreateSnapshotValueApiResponse = {
    status: number;
    data?: {
        snapshot_value: SnapshotValue;
    };
    error?: string;
};

export async function createSnapshotValue(token: string, snapshotId: number, payload: CreateSnapshotValuePayload): Promise<CreateSnapshotValueApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}/values`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateSnapshotValueApiResponse;
}