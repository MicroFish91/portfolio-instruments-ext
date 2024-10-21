import { l10n } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";

export class AccountDescriptionStep<T extends AccountCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.accountDescription = (await context.ui.showInputBox({
            title: this.title,
            value: context.account?.description,
            prompt: l10n.t('Enter an account description'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.accountDescription;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();
        if (!value) {
            return undefined;
        }

        const tc: validationUtils.RangeConstraints = {
            upperLimitIncl: 1024,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        return undefined;
    }
}