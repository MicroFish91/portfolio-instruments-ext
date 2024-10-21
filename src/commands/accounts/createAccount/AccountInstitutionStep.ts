import { l10n } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";

export class AccountInstitutionStep<T extends AccountCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.accountInstitution = (await context.ui.showInputBox({
            title: this.title,
            value: context.account?.institution,
            prompt: l10n.t('Enter the account institution'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.accountInstitution;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();

        const tc: validationUtils.RangeConstraints = {
            lowerLimitIncl: 1,
            upperLimitIncl: 64,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        return undefined;
    }
}