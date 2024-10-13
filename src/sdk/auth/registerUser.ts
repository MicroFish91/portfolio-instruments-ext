import { Settings } from "../types/settings";
import { User } from "../types/user";

export type RegisterUserPayload = {
    email: string;
    password: string;
};

export type RegisterUserApiResponse = {
    status: number;
    user?: User;
    settings?: Settings;
    errorMessage?: string;
};

export async function registerUser(payload: RegisterUserPayload): Promise<RegisterUserApiResponse> {
    const response = await fetch("http://localhost:3000/api/v1/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as RegisterUserApiResponse;
}