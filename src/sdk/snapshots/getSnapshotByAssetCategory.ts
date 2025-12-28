import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotHoldingsResponse } from "../portfolio-instruments-api";

export async function getSnapshotByAssetCategory(token: string, snapshotId: number): Promise<GetSnapshotHoldingsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}?group_by=ASSET_CATEGORY`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotHoldingsResponse;
}