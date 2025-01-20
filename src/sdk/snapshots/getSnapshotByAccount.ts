import { settingUtils } from "../../utils/settingUtils";
import { ResourcesGrouped } from "../types/snapshots";

export type GetSnapshotByAccountApiResponse = {
    status: number;
    data?: {
        accounts_grouped: ResourcesGrouped;
        field_type: string;
    };
    error?: string;
};

export async function getSnapshotByAccount(token: string, snapshotId: number): Promise<GetSnapshotByAccountApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots/${snapshotId}?group_by=ACCOUNT_INSTITUTION`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSnapshotByAccountApiResponse;
}