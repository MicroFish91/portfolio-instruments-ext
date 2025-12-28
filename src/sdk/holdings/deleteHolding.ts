import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { DeleteHoldingResponse } from "../portfolio-instruments-api";

export async function deleteHolding(token: string, holdingId: number): Promise<DeleteHoldingResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/holdings/${holdingId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteHoldingResponse;
}