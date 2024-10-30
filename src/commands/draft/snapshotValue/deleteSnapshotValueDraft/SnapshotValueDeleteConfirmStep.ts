import { l10n } from "vscode";
import { SnapshotValueDraftDeleteContext } from "./SnapshotValueDraftDeleteContext";
import { PromptStep } from "../../../../wizard/PromptStep";

export class SnapshotValueDeleteConfirmStep<T extends SnapshotValueDraftDeleteContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Are you sure you want to delete snapshot value with total "{0}" (draft)?', context.snapshotValueDraft.total);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}