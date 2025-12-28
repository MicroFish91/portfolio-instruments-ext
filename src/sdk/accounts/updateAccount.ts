import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { UpdateAccountPayload, UpdateAccountResponse } from "../portfolio-instruments-api";

export async function updateAccount(token: string, accountId: number, payload: UpdateAccountPayload): Promise<UpdateAccountResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/accounts/${accountId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateAccountResponse;
}