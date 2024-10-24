import { PaginationMetadata } from "../types/pagination";
import { Snapshot } from "../types/snapshots";

export type GetSnapshotsApiResponse = {
    status: number;
    data?: {
        snapshots: Snapshot[];
        pagination: PaginationMetadata;
    };
    error?: string;
};

export async function getSnapshots(token: string): Promise<GetSnapshotsApiResponse> {
    const response = await fetch("http://localhost:3000/api/v1/snapshots", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}