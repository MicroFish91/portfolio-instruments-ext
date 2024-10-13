import { Progress } from "vscode";
import { registerUser, RegisterUserApiResponse } from "../../../sdk/auth/registerUser";
import { nonNullProp } from "../../../utils/nonNull";
import { RegisterContext } from "./RegisterContext";

export class RegisterUserExecuteStep<T extends RegisterContext> {
    priority: 100;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Registering new user..." });

        const response: RegisterUserApiResponse = await registerUser({
            email: nonNullProp(context, 'email'),
            password: nonNullProp(context, 'password'),
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.user = response.user;
        context.settings = response.settings;
    }

    shouldExecute(context: T): boolean {
        return !context.user;
    }
}
