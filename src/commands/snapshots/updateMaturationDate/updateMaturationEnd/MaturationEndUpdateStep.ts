import { l10n, Progress } from "vscode";
import { MaturationUpdateContext } from "../MaturationUpdateContext";
import { SnapshotMaturationEndItem } from "../../../../tree/snapshots/snapshot/dashboard/maturationDate/SnapshotMaturationEndItem";

export class MaturationEndUpdateStep<T extends MaturationUpdateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Updating maturation end...") });
        SnapshotMaturationEndItem.setMaturationEnd(context.email, context.snapshotId, context.maturationDate || undefined);
    }

    shouldExecute(): boolean {
        return true;
    }
}
