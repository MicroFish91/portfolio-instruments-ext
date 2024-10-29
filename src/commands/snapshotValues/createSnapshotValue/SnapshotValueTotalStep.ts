import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { SnapshotValueCreateContext } from "./SnapshotValueCreateContext";

export class SnapshotValueTotalStep<T extends SnapshotValueCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.total = Number((await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter a snapshot value amount ($)'),
            validateInput: this.validateInput,
        }))?.trim());
    }

    shouldPrompt(context: T): boolean {
        return !context.total;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();

        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        const pattern: RegExp = /^\d+(\.\d{2})?$/;
        if (!pattern.test(value)) {
            return l10n.t('Please enter a valid dollar value amount (e.g. 10.25).');
        }

        return undefined;
    }
}