import { MaturationDateResource } from "../types/snapshots";

export type GetSnapshotByMaturationDateApiResponse = {
    status: number;
    data?: {
        resources: MaturationDateResource[];
        field_type: string;
        maturation_start: string;
        maturation_end: string;
    };
    error?: string;
};

export type GetSnapshotMaturationDateOptions = {
    startDate?: string;
    endDate?: string;
};

export async function getSnapshotByMaturationDate(token: string, snapshotId: number, options?: GetSnapshotMaturationDateOptions): Promise<GetSnapshotByMaturationDateApiResponse> {
    let url: string = `http://localhost:3000/api/v1/snapshots/${snapshotId}?group_by=MATURATION_DATE`;
    if (options?.startDate) {
        url += `&maturation_start=${options.startDate}`;
    }

    if (options?.endDate) {
        url += `&maturation_end=${options.endDate}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotByMaturationDateApiResponse;
}