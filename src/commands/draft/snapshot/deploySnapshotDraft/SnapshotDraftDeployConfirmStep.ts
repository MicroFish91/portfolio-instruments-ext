import { l10n } from "vscode";
import { SnapshotDraftDeployContext } from "./SnapshotDraftDeployContext";
import { PromptStep } from "../../../../wizard/PromptStep";

export class SnapshotDraftDeployConfirmStep<T extends SnapshotDraftDeployContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Deploy snapshot draft dated "{0}"?', context.snapshotPayload.snap_date);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}