import { validationUtils } from "../../utils/validationUtils";
import { PromptStep } from "../../wizard/PromptStep";
import { RegisterContext } from "./RegisterContext";

export class UserPasswordPromptStep<T extends RegisterContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.password = (await context.ui.showInputBox({
            prompt: 'Enter a password',
            password: true,
            validateInput: this.validateInput,
        }));
    }

    shouldPrompt(context: T): boolean {
        return !context.password && !context.user;
    }

    private validateInput(value: string): string | undefined {
        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }
        return undefined;
    }
}