import { Account } from "../types/accounts";

export type DeleteAccountApiResponse = {
    status: number;
    data?: {
        message: string;
        account: Account;
    };
    error?: string;
};

export async function deleteAccount(token: string, accountId: number): Promise<DeleteAccountApiResponse> {
    const response = await fetch(`http://localhost:3000/api/v1/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as DeleteAccountApiResponse;
}