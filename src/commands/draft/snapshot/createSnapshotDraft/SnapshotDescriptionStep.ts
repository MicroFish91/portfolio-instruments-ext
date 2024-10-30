import { l10n } from "vscode";
import { SnapshotCreateContext } from "../../../snapshots/SnapshotCreateContext";
import { PromptStep } from "../../../../wizard/PromptStep";
import { validationUtils } from "../../../../utils/validationUtils";

export class SnapshotDescriptionStep<T extends SnapshotCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.snapDescription = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter a snapshot description'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.snapDescription;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();
        if (!value) {
            return undefined;
        }

        const tc: validationUtils.RangeConstraints = {
            upperLimitIncl: 1024,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        return undefined;
    }
}