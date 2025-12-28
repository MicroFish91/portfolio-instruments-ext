import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetSnapshotLiquidityResponse } from "../portfolio-instruments-api";

export async function getSnapshotByLiquidity(token: string, snapshotId: number): Promise<GetSnapshotLiquidityResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/snapshots/${snapshotId}?group_by=LIQUIDITY`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotLiquidityResponse;
}
