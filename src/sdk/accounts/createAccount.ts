import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { CreateAccountPayload, CreateAccountResponse } from "../portfolio-instruments-api";

export async function createAccount(token: string, payload: CreateAccountPayload): Promise<CreateAccountResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/accounts`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateAccountResponse;
}