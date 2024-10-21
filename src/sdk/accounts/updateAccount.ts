import { Account, TaxShelter } from "../types/accounts";

export type UpdateAccountPayload = {
    name: string;
    description?: string;
    tax_shelter: TaxShelter;
    institution: string;
    is_deprecated?: boolean;
};

export type UpdateAccountApiResponse = {
    status: number;
    data?: {
        account: Account;
    };
    error?: string;
};

export async function updateAccount(token: string, accountId: number, payload: UpdateAccountPayload): Promise<UpdateAccountApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/accounts/${accountId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateAccountApiResponse;
}