import { l10n } from "vscode";
import { validationUtils } from "../../utils/validationUtils";
import { PromptStep } from "../../wizard/PromptStep";
import { RegisterContext } from "./register/RegisterContext";

export class UserPasswordPromptStep<T extends RegisterContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.password = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter a password'),
            password: true,
            validateInput: this.validateInput,
        }));
    }

    shouldPrompt(context: T): boolean {
        return !context.password && !context.user;
    }

    private validateInput(value: string): string | undefined {
        const rc: validationUtils.RangeConstraints = {
            lowerLimitIncl: 5,
            upperLimitIncl: 60,
        };

        if (!validationUtils.hasValidCharLength(value, rc)) {
            return validationUtils.getInvalidCharLengthMessage(rc);
        }
        return undefined;
    }
}