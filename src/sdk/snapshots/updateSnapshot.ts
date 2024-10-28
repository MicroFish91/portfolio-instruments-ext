import { Snapshot } from "../types/snapshots";

export type UpdateSnapshotPayload = {
    snap_date: string;
    description?: string;
    benchmark_id?: number;
};

export type UpdateSnapshotApiResponse = {
    status: number;
    data?: {
        snapshot: Snapshot;
    };
    error?: string;
};

export async function updateSnapshot(token: string, snapshotId: number, payload: UpdateSnapshotPayload): Promise<UpdateSnapshotApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateSnapshotApiResponse;
}