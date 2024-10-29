import { l10n, Progress } from "vscode";
import { SnapshotDraftUpdateContext } from "./SnapshotDraftUpdateContext";
import { ext } from "../../../extensionVariables";
import { SnapshotDraftItem } from "../../../tree/snapshots/draft/SnapshotDraftItem";
import { nonNullProp } from "../../../utils/nonNull";

export class SnapshotDraftUpdateStep<T extends SnapshotDraftUpdateContext> {
    priority: 200;
    constructor(readonly item: SnapshotDraftItem) { }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Updating snapshot draft...") });

        ext.snapshotDraftFileSystem.updateSnapshotDraft(this.item, {
            snap_date: nonNullProp(context, 'snapDate'),
            description: context.snapDescription,
            benchmark_id: context.benchmarkId,
        });
    }

    shouldExecute(): boolean {
        return true;
    }
}
