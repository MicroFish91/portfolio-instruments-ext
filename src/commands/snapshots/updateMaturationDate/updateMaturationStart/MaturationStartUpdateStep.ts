import { l10n, Progress } from "vscode";
import { SnapshotMaturationStartItem } from "../../../../tree/snapshots/snapshot/dashboard/maturationDate/SnapshotMaturationStartItem";
import { MaturationUpdateContext } from "../MaturationUpdateContext";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";

export class MaturationStartUpdateStep<T extends MaturationUpdateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Updating maturation start...") });
        SnapshotMaturationStartItem.setMaturationStart(context.email, context.snapshotId, context.maturationDate || undefined);
    }

    shouldExecute(): boolean {
        return true;
    }
}
