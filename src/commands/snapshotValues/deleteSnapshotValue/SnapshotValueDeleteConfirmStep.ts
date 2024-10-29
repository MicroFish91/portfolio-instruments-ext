import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { SnapshotValueDeleteContext } from "./SnapshotValueDeleteContext";

export class SnapshotValueDeleteConfirmStep<T extends SnapshotValueDeleteContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Are you sure you want to delete snapshot value with total "{0}"?', context.snapshotValue.total);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}