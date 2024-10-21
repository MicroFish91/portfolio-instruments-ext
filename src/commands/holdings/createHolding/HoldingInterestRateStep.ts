import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { HoldingCreateContext } from "./HoldingCreateContext";

export class HoldingInterestRateStep<T extends HoldingCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.holdingInterestRatePct = Number((await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter holding interest rate (%)'),
            validateInput: this.validateInput,
        })));
    }

    shouldPrompt(context: T): boolean {
        return !context.holdingInterestRatePct && !context.holding;
    }

    private validateInput(value: string): string | undefined {
        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        if (isNaN(Number(value))) {
            return l10n.t('Value must have a number format.');
        }

        const num: number = Number(value);
        if (num < 0 || num > 100) {
            return l10n.t('Value must be between 0 and 100.');
        }

        return undefined;
    }
}