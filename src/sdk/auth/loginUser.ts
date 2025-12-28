import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { LoginResponse, LoginUserPayload } from "../portfolio-instruments-api";

export async function loginUser(payload: LoginUserPayload): Promise<LoginResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as LoginResponse;
}