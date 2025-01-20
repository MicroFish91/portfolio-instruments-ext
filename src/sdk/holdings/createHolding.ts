import { settingUtils } from "../../utils/settingUtils";
import { AssetCategory, Holding } from "../types/holdings";

export type CreateHoldingPayload = {
    name: string;
    ticker?: string;
    asset_category: AssetCategory;
    expense_ratio_pct?: number;
    maturation_date?: string;
    interest_rate_pct?: number;
    is_deprecated?: boolean;
};

export type CreateHoldingApiResponse = {
    status: number;
    data?: {
        holding: Holding;
    };
    error?: string;
};

export async function createHolding(token: string, payload: CreateHoldingPayload): Promise<CreateHoldingApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/holdings`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateHoldingApiResponse;
}