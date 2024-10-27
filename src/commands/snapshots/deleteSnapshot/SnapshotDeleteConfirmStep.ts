import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { SnapshotDeleteContext } from "./SnapshotDeleteContext";

export class SnapshotDeleteConfirmStep<T extends SnapshotDeleteContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Are you sure you want to delete snapshot dated "{0}"?', context.snapshot.snap_date);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}