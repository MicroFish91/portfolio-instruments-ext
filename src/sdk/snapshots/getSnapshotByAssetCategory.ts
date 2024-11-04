import { ResourcesGrouped } from "../types/snapshots";

export type GetSnapshotByAssetCategoryApiResponse = {
    status: number;
    data?: {
        holdings_grouped: ResourcesGrouped;
        field_type: string;
    };
    error?: string;
};

export async function getSnapshotByAssetCategory(token: string, snapshotId: number): Promise<GetSnapshotByAssetCategoryApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}?group_by=ASSET_CATEGORY`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotByAssetCategoryApiResponse;
}