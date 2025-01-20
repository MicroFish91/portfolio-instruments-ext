import { settingUtils } from "../../utils/settingUtils";
import { AssetCategory, Holding } from "../types/holdings";

export type UpdateHoldingPayload = {
    name: string;
    ticker?: string;
    asset_category: AssetCategory;
    expense_ratio_pct?: number;
    maturation_date?: string;
    interest_rate_pct?: number;
    is_deprecated?: boolean;
};

export type UpdateHoldingApiResponse = {
    status: number;
    data?: {
        holding: Holding;
    };
    error?: string;
};

export async function updateHolding(token: string, holdingId: number, payload: UpdateHoldingPayload): Promise<UpdateHoldingApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/holdings/${holdingId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateHoldingApiResponse;
}