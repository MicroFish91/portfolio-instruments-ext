import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotAccountsResponse } from "../portfolio-instruments-api";

export async function getSnapshotByTaxShelter(token: string, snapshotId: number): Promise<GetSnapshotAccountsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}?group_by=TAX_SHELTER`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotAccountsResponse;
}