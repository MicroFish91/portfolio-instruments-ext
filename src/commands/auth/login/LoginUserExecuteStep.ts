import { Progress } from "vscode";
import { nonNullProp, nonNullValueAndProp } from "../../../utils/nonNull";
import { LoginContext } from "./LoginContext";
import { loginUser } from "../../../sdk/auth/loginUser";
import { storeAuthToken } from "../../../utils/tokenUtils";
import { LoginResponse } from "../../../sdk/portfolio-instruments-api";

export class LoginUserExecuteStep<T extends LoginContext> {
    priority: 100;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Signing in..." });

        const response: LoginResponse = await loginUser({
            email: nonNullProp(context, 'email'),
            password: nonNullProp(context, 'password'),
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.token = response.data?.token;
        context.user = response.data?.user;

        await storeAuthToken(nonNullValueAndProp(context.user, 'email'), nonNullProp(context, 'token'));
    }

    shouldExecute(context: T): boolean {
        return !context.token;
    }
}
