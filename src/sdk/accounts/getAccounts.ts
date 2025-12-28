import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { GetAccountsResponse } from "../portfolio-instruments-api";

export async function getAccounts(token: string): Promise<GetAccountsResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/accounts`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetAccountsResponse;
}