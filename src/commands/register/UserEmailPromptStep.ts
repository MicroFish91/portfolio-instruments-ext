import { validationUtils } from "../../utils/validationUtils";
import { PromptStep } from "../../wizard/PromptStep";
import { RegisterContext } from "./RegisterContext";

export class UserEmailPromptStep<T extends RegisterContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.email = (await context.ui.showInputBox({
            prompt: 'Enter an email address',
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.email && !context.user;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();

        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        const email: RegExp = /(.+)@[a-z]+\.[a-z]+/;
        if (!email.test(value)) {
            return "Unrecognized email address format.";
        }

        return undefined;
    }
}