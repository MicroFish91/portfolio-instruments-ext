import { settingUtils } from "../../utils/settingUtils";
import { Holding } from "../types/holdings";

export type DeleteHoldingApiResponse = {
    status: number;
    data?: {
        message: string;
        holding: Holding;
    };
    error?: string;
};

export async function deleteHolding(token: string, holdingId: number): Promise<DeleteHoldingApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/holdings/${holdingId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteHoldingApiResponse;
}