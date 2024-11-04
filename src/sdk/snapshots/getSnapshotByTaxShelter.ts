import { ResourcesGrouped } from "../types/snapshots";

export type GetSnapshotByTaxShelterApiResponse = {
    status: number;
    data?: {
        accounts_grouped: ResourcesGrouped;
        field_type: string;
    };
    error?: string;
};

export async function getSnapshotByTaxShelter(token: string, snapshotId: number): Promise<GetSnapshotByTaxShelterApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots/${snapshotId}?group_by=TAX_SHELTER`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotByTaxShelterApiResponse;
}