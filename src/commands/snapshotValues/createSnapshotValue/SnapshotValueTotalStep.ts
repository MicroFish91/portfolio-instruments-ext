import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { SnapshotValue } from "../../../sdk/types/snapshots";
import { CommandContext } from "../../registerCommand";

export type SnapshotValueTotalStepOptions = {
    defaultValue?: number;
};

export class SnapshotValueTotalStep<T extends CommandContext & { snapshotValue?: SnapshotValue, total?: number }> extends PromptStep<T> {
    constructor(readonly options?: SnapshotValueTotalStepOptions) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.total = Number((await context.ui.showInputBox({
            title: this.title,
            value: this.options?.defaultValue?.toString() ?? context.snapshotValue?.total.toString(),
            prompt: l10n.t('Enter a snapshot value amount ($)'),
            validateInput: this.validateInput,
        }))?.trim().replace(/,/g, ''));
    }

    shouldPrompt(context: T): boolean {
        return !context.total;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();
        value = value.replace(/,/g, '');

        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        const pattern: RegExp = /^(-)?\d+(\.\d{2})?$/;
        if (!pattern.test(value)) {
            return l10n.t('Please enter a valid dollar value amount (e.g. 10.25).');
        }

        return undefined;
    }
}