import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";

export class BenchmarkDrawdownYearsStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.benchmarkDrawdownYears = Number((await context.ui.showInputBox({
            title: this.title,
            value: String(context.benchmark?.drawdown_yrs ?? 0),
            prompt: l10n.t('Enter benchmark\'s longest drawdown (yrs)'),
            validateInput: this.validateInput,
        }))?.trim());
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkDrawdownYears;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();
        if (!value) {
            return undefined;
        }

        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        const pattern: RegExp = /^\d+$/;
        if (pattern.test(value)) {
            return l10n.t('Value must be a positive whole number.');
        }

        const num: number = Number(value);
        if (num < 0 || num > 50) {
            return l10n.t('Value must be between 0 and 50.');
        }

        return undefined;
    }
}