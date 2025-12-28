import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotMaturationDateResponse } from "../portfolio-instruments-api";

export type GetSnapshotMaturationDateOptions = {
    startDate?: string;
    endDate?: string;
};

export async function getSnapshotByMaturationDate(token: string, snapshotId: number, options?: GetSnapshotMaturationDateOptions): Promise<GetSnapshotMaturationDateResponse> {
    let url: string = `${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}?group_by=MATURATION_DATE`;
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
    return await response.json() as GetSnapshotMaturationDateResponse;
}