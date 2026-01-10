import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";

export class BenchmarkRebalanceThresholdStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.benchmarkRebalanceThresholdPct = Number((await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter benchmark\'s recommended rebalance threshold (%)'),
            value: context.benchmark?.rec_rebalance_threshold_pct?.toString(),
            validateInput: this.validateInput,
        })));
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkRebalanceThresholdPct;
    }

    private validateInput(value: string): string | undefined {
        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        const num: number = Number(value);
        if (isNaN(num) || !Number.isInteger(num)) {
            return l10n.t('Value must be a whole number.');
        }

        if (num < 1 || num > 99) {
            return l10n.t('Value must be between 1 and 99.');
        }

        return undefined;
    }
}