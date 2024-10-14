import { l10n } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";

export class AccountNameStep<T extends AccountCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.accountName = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter the account name'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.accountName && !context.account;
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