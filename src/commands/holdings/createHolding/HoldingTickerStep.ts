import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { HoldingCreateContext } from "./HoldingCreateContext";

export class HoldingTickerStep<T extends HoldingCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.holdingTicker = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter holding ticker'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.holdingTicker && !context.holding;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();

        const tc: validationUtils.RangeConstraints = {
            lowerLimitIncl: 1,
            upperLimitIncl: 32,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        return undefined;
    }
}