import { settingUtils } from "../../utils/settingUtils";
import { Settings } from "../types/settings";

export type UpdateSettingsPayload = {
    reb_thresh_pct: number;
    benchmark_id?: number;
};

export type UpdateSettingsApiResponse = {
    status: number;
    data?: {
        settings: Settings;
    };
    error?: string;
};

export async function updateSettings(token: string, userId: number, payload: UpdateSettingsPayload): Promise<UpdateSettingsApiResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/users/${userId}/settings`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as UpdateSettingsApiResponse;
}