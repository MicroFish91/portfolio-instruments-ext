import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { UpdateHoldingPayload, UpdateHoldingResponse } from "../portfolio-instruments-api";

export async function updateHolding(token: string, holdingId: number, payload: UpdateHoldingPayload): Promise<UpdateHoldingResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/holdings/${holdingId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateHoldingResponse;
}