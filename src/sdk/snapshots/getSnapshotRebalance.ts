import { AssetAllocation } from "../types/snapshots";

export type GetSnapshotRebalanceApiResponse = {
    status: number;
    data?: {
        target_allocation: AssetAllocation[];
        current_allocation: AssetAllocation[];
        change_required: AssetAllocation[];
        rebalance_thresh_pct: number;
        snapshot_total: number;
        snapshot_total_omit_skips: number;
    };
    error?: string;
};

export async function getSnapshotRebalance(token: string, snapshotId: number): Promise<GetSnapshotRebalanceApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}/rebalance`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotRebalanceApiResponse;
}