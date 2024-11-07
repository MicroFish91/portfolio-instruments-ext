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

export async function getSnapshots(token: string, page: number): Promise<GetSnapshotsApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/snapshots?order_date_by=DESC&current_page=${page}&page_size=10`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}

export async function getSnapshotsLatest(token: string): Promise<GetSnapshotsApiResponse> {
    const response = await fetch("http://localhost:3000/api/v1/snapshots?order_date_by=DESC&page_size=1", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}