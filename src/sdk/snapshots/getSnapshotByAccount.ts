import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotAccountsResponse } from "../portfolio-instruments-api";

export async function getSnapshotByAccount(token: string, snapshotId: number): Promise<GetSnapshotAccountsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}?group_by=ACCOUNT_INSTITUTION`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotAccountsResponse;
}