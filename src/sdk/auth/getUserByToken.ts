import { Settings } from "../types/settings";
import { User } from "../types/user";

export type GetUserByTokenApiResponse = {
    status: number;
    data?: {
        user: User;
        settings: Settings;
    };
    error?: string;
};

export async function getUserByToken(token: string): Promise<GetUserByTokenApiResponse> {
    const response = await fetch("http://localhost:3000/api/v1/me", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetUserByTokenApiResponse;
}