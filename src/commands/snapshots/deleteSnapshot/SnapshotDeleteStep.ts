import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { SnapshotDeleteContext } from "./SnapshotDeleteContext";
import { deleteSnapshot } from "../../../sdk/snapshots/deleteSnapshot";
import { DeleteSnapshotResponse } from "../../../sdk/portfolio-instruments-api";

export class SnapshotDeleteStep<T extends SnapshotDeleteContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Deleting snapshot...") });

        const response: DeleteSnapshotResponse = await deleteSnapshot(nonNullProp(context, 'token'), context.snapshot.snap_id);
        if (response.error) {
            throw new Error(response.error);
        }
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshot;
    }
}
