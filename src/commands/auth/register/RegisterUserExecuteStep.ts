import { Progress } from "vscode";
import { registerUser } from "../../../sdk/auth/registerUser";
import { nonNullProp } from "../../../utils/nonNull";
import { RegisterContext } from "./RegisterContext";
import { RegisterResponse } from "../../../sdk/portfolio-instruments-api";

export class RegisterUserExecuteStep<T extends RegisterContext> {
    priority: 100;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Registering new user..." });

        const response: RegisterResponse = await registerUser({
            email: nonNullProp(context, 'email'),
            password: nonNullProp(context, 'password'),
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.user = response.data?.user;
    }

    shouldExecute(context: T): boolean {
        return !context.user;
    }
}
