import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";

export class BenchmarkStdDevStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.benchmarkStdDev = Number((await context.ui.showInputBox({
            title: this.title,
            value: String(context.benchmark?.std_dev_pct ?? 0),
            prompt: l10n.t('Enter benchmark\'s standard deviation (%)'),
            validateInput: this.validateInput,
        })));
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkStdDev;
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