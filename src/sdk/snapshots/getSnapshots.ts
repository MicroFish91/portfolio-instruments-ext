import { settingUtils } from "../../utils/settingUtils";
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
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots?order_date_by=DESC&current_page=${page}&page_size=10`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}

export async function getSnapshotsByDateRange(token: string, startDate: string, endDate: string) {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots?order_date_by=DESC&snap_date_lower=${startDate}&snap_date_upper=${endDate}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}

export async function getSnapshotsLatest(token: string): Promise<GetSnapshotsApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots?order_date_by=DESC&page_size=1`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}

export async function getSnapshotsEarliest(token: string): Promise<GetSnapshotsApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots?order_date_by=ASC&page_size=1`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsApiResponse;
}
