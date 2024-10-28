import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { SnapshotUpdateContext } from "./SnapshotUpdateContext";
import { updateSnapshot, UpdateSnapshotApiResponse } from "../../../sdk/snapshots/updateSnapshot";

export class SnapshotUpdateStep<T extends SnapshotUpdateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Updating snapshot...") });

        const response: UpdateSnapshotApiResponse = await updateSnapshot(nonNullProp(context, 'token'), context.snapshot.snap_id, {
            snap_date: nonNullProp(context, 'snapDate'),
            description: context.snapDescription,
            benchmark_id: context.benchmarkId,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.updatedSnapshot = response.data?.snapshot;
    }

    shouldExecute(context: T): boolean {
        return !context.updatedSnapshot;
    }
}
