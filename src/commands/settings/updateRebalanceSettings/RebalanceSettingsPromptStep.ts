import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { RebalanceSettingsUpdateContext } from "./RebalanceSettingsUpdateContext";

export class RebalanceSettingsPromptStep<T extends RebalanceSettingsUpdateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.rebalanceThreshold = Number((await context.ui.showInputBox({
            title: this.title,
            value: context.settings.reb_thresh_pct?.toString(),
            prompt: l10n.t('Enter rebalance threshold (%)'),
            validateInput: this.validateInput,
        })));
    }

    shouldPrompt(context: T): boolean {
        return !context.rebalanceThreshold;
    }

    private validateInput(value: string): string | undefined {
        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        if (!/^\d{1,2}$/.test(value)) {
            return l10n.t('Value must be a whole number.');
        }

        const num: number = Number(value);
        if (num < 0 || num > 50) {
            return l10n.t('Value must be between 0 and 50.');
        }

        return undefined;
    }
}