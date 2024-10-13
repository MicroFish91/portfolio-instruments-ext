import { window } from "vscode";
import { RegisterContext } from "./RegisterContext";
import { RegisterUserApiResponse, registerUser, RegisterUserPayload } from "../../sdk/auth/registerUser";

export async function register(_: RegisterContext) {
    window.showInformationMessage("called register");

    // Build a lightweight wizard
    // Prompt for values
    const registerUserPayload: RegisterUserPayload = {
        email: "test_user@gmail.com",
        password: "abcd1234",
    };
    const response: RegisterUserApiResponse = await registerUser(registerUserPayload);
    console.log(response);
}