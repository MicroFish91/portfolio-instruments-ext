import { l10n, Progress } from "vscode";
import { MaturationStartUpdateContext } from "./MaturationStartUpdateContext";
import { SnapshotMaturationStartItem } from "../../../../tree/snapshots/snapshot/dashboard/maturationDate/SnapshotMaturationStartItem";

export class MaturationStartUpdateStep<T extends MaturationStartUpdateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Updating maturation start...") });
        SnapshotMaturationStartItem.setMaturationStart(context.email, context.snapshotId, context.maturationDate || undefined);
    }

    shouldExecute(): boolean {
        return true;
    }
}
