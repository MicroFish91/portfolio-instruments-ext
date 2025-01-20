import { settingUtils } from "../../utils/settingUtils";
import { Account } from "../types/accounts";
import { PaginationMetadata } from "../types/pagination";

export type GetAccountsApiResponse = {
    status: number;
    data?: {
        accounts: Account[];
        pagination: PaginationMetadata;
    };
    error?: string;
};

export async function getAccounts(token: string): Promise<GetAccountsApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/accounts`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetAccountsApiResponse;
}