import { l10n, Progress } from "vscode";
import { SnapshotValueDraftDeleteContext } from "./SnapshotValueDraftDeleteContext";
import { ext } from "../../../../extensionVariables";
import { SnapshotDraftItem } from "../../../../tree/snapshots/draft/SnapshotDraftItem";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../../../sdk/portfolio-instruments-api";

export class SnapshotValueDraftDeleteStep<T extends SnapshotValueDraftDeleteContext> {
    priority: 200;
    constructor(readonly item: SnapshotDraftItem) { }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>): Promise<void> {
        progress.report({ message: l10n.t("Deleting snapshot value (draft)...") });

        const snapshotDraft: CreateSnapshotPayload | undefined = ext.snapshotDraftFileSystem.parseSnapshotDraft(this.item.email);
        let snapshotValues: CreateSnapshotValuePayload[] = snapshotDraft?.snapshot_values ?? [];

        snapshotValues = snapshotValues.filter((_, idx) => idx !== context.svIdx);
        await ext.snapshotDraftFileSystem.updateSnapshotValuesDraft(this.item, snapshotValues);
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshotValueDraft && context.svIdx !== undefined;
    }
}
