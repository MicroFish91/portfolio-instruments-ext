import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { SnapshotCreateContext } from "../../snapshots/SnapshotCreateContext";

export class SnapshotRebalanceThresholdStep<T extends SnapshotCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.rebalanceThresholdPct = Number((await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter the snapshot\'s rebalance threshold (%)'),
            validateInput: this.validateInput,
        })));
    }

    shouldPrompt(context: T): boolean {
        return !context.rebalanceThresholdPct;
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