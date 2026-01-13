import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotsResponse } from "../portfolio-instruments-api";

export async function getSnapshots(token: string, page: number): Promise<GetSnapshotsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots?order_date_by=DESC&current_page=${page}&page_size=10`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsResponse;
}

export async function getSnapshotsByDateRange(token: string, startDate: string, endDate: string) {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots?order_date_by=DESC&snap_date_lower=${startDate}&snap_date_upper=${endDate}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsResponse;
}

export async function getSnapshotsLatest(token: string): Promise<GetSnapshotsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots?order_date_by=DESC&page_size=1`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsResponse;
}

export async function getSnapshotsEarliest(token: string): Promise<GetSnapshotsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots?order_date_by=ASC&page_size=1`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsResponse;
}

export async function getMostRecentSnapshotByDate(token: string, date: string): Promise<GetSnapshotsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots?order_date_by=DESC&snap_date_upper=${date}&page_size=1`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotsResponse;
}
