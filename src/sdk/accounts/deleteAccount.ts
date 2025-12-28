import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { DeleteAccountResponse } from "../portfolio-instruments-api";

export async function deleteAccount(token: string, accountId: number): Promise<DeleteAccountResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteAccountResponse;
}