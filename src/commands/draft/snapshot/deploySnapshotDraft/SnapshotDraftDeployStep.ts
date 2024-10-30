import { Progress } from "vscode";
import { SnapshotDraftDeployContext } from "./SnapshotDraftDeployContext";
import { createSnapshot, CreateSnapshotApiResponse } from "../../../../sdk/snapshots/createSnapshot";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";

export class SnapshotDraftDeployStep<T extends SnapshotDraftDeployContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating snapshot..." });

        const response: CreateSnapshotApiResponse = await createSnapshot(context.token, {
            snap_date: context.snapshotPayload.snap_date,
            description: context.snapshotPayload.description,
            benchmark_id: context.snapshotPayload.benchmark_id,
            snapshot_values: context.snapshotPayload.snapshot_values,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.snapshot = response.data?.snapshot;
    }

    shouldExecute(context: T): boolean {
        return !context.snapshot;
    }
}
