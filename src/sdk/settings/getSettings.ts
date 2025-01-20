import { settingUtils } from "../../utils/settingUtils";
import { Holding } from "../types/holdings";
import { PaginationMetadata } from "../types/pagination";

export type GetSettingsApiResponse = {
    status: number;
    data?: {
        holdings: Holding[];
        pagination: PaginationMetadata;
    };
    error?: string;
};

export async function getHoldings(token: string): Promise<GetSettingsApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/holdings`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetSettingsApiResponse;
}