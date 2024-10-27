import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { SnapshotDeleteContext } from "./SnapshotDeleteContext";
import { deleteSnapshot, DeleteSnapshotApiResponse } from "../../../sdk/snapshots/deleteSnapshot";

export class SnapshotDeleteStep<T extends SnapshotDeleteContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Deleting snapshot...") });

        const response: DeleteSnapshotApiResponse = await deleteSnapshot(nonNullProp(context, 'token'), context.snapshot.snap_id);
        if (response.error) {
            throw new Error(response.error);
        }
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshot;
    }
}
