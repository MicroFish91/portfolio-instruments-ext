import { Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { ext } from "../../../extensionVariables";
import { SnapshotsItem } from "../../../tree/snapshots/SnapshotsItem";
import { nonNullProp } from "../../../utils/nonNull";
import { getSnapshotLatest } from "../../../sdk/snapshots/getSnapshot";

export class SnapshotDraftCreateStep<T extends SnapshotDraftCreateContext> extends ExecuteStep<T> {
    priority: 200;

    constructor(readonly parentItem: SnapshotsItem) {
        super();
    }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating snapshot draft..." });

        ext.snapshotDraftFileSystem.createSnapshotDraft(
            this.parentItem,
            {
                snap_date: nonNullProp(context, 'snapDate'),
                description: context.snapDescription,
                benchmark_id: context.benchmarkId,
            },
            (await getSnapshotLatest(context.token)).data?.snapshot_values ?? [],
        );
    }

    shouldExecute(context: T): boolean {
        return !ext.snapshotDraftFileSystem.hasSnapshotDraft(context.email);
    }
}
