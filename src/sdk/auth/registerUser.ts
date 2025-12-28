import { latestApiVersion } from "../../constants";
import { settingUtils } from "../../utils/settingUtils";
import { RegisterResponse, RegisterUserPayload } from "../portfolio-instruments-api";

export async function registerUser(payload: RegisterUserPayload): Promise<RegisterResponse> {
    const response = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/${latestApiVersion}/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return await response.json() as RegisterResponse;
}