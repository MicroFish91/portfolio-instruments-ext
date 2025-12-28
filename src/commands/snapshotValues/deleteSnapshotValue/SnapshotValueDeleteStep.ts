import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { SnapshotValueDeleteContext } from "./SnapshotValueDeleteContext";
import { deleteSnapshotValue } from "../../../sdk/snapshotValue/deleteSnapshotValue";
import { DeleteSnapshotValueResponse } from "../../../sdk/portfolio-instruments-api";

export class SnapshotValueDeleteStep<T extends SnapshotValueDeleteContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Deleting snapshot value...") });

        const response: DeleteSnapshotValueResponse = await deleteSnapshotValue(nonNullProp(context, 'token'), context.snapshotId, context.snapshotValue.snap_val_id);
        if (response.error) {
            throw new Error(response.error);
        }
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshotValue;
    }
}
