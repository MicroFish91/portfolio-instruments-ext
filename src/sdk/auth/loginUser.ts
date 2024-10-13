import { User } from "../types/user";

export type LoginUserPayload = {
    email: string;
    password: string;
};

export type LoginUserApiResponse = {
    status: number;
    data?: {
        token?: string;
        user?: User;
    };
    error?: string;
};

export async function loginUser(payload: LoginUserPayload): Promise<LoginUserApiResponse> {
    const response = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as LoginUserApiResponse;
}