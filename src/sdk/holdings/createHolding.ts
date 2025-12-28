import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { CreateHoldingPayload, CreateHoldingResponse } from "../portfolio-instruments-api";

export async function createHolding(token: string, payload: CreateHoldingPayload): Promise<CreateHoldingResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/holdings`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateHoldingResponse;
}