import { settingUtils } from "../../utils/settingUtils";
import { Account, TaxShelter } from "../types/accounts";

export type CreateAccountPayload = {
    name: string;
    description?: string;
    tax_shelter: TaxShelter;
    institution: string;
    is_deprecated?: boolean;
};

export type CreateAccountApiResponse = {
    status: number;
    data?: {
        account: Account;
    };
    error?: string;
};

export async function createAccount(token: string, payload: CreateAccountPayload): Promise<CreateAccountApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/accounts`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as CreateAccountApiResponse;
}