import { Account } from "../types/accounts";
import { Holding } from "../types/holdings";
import { Snapshot, SnapshotValue } from "../types/snapshots";
import { GetSnapshotsApiResponse, getSnapshotsLatest } from "./getSnapshots";

export type GetSnapshotApiResponse = {
    status: number;
    data?: {
        snapshot: Snapshot;
        snapshot_values: SnapshotValue[];
        accounts: Account[];
        holdings: Holding[];
    };
    error?: string;
};

export async function getSnapshot(token: string, snapshotId: number): Promise<GetSnapshotApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotApiResponse;
}

export async function getSnapshotLatest(token: string): Promise<GetSnapshotApiResponse> {
    const snapshotsResponse: GetSnapshotsApiResponse = await getSnapshotsLatest(token);
    if (snapshotsResponse.error) {
        return {
            status: snapshotsResponse.status,
            data: undefined,
            error: snapshotsResponse.error,
        };
    }
    return await getSnapshot(token, snapshotsResponse.data?.snapshots?.[0].snap_id ?? 0);
}