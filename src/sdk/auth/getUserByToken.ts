import { Settings } from "../types/settings";
import { User } from "../types/user";

export type GetUserByToken = {
    status: number;
    data?: {
        user: User;
        settings: Settings;
    };
    error?: string;
};

export async function getUserByToken(token: string): Promise<GetUserByToken> {
    const response = await fetch("http://localhost:3000/api/v1/me", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.json() as GetUserByToken;
}