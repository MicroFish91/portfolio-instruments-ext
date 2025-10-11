import { l10n, Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { SnapshotsPlotContext } from "./SnapshotsPlotContext";
import { GetSnapshotsApiResponse, getSnapshotsByDateRange } from "../../../sdk/snapshots/getSnapshots";

export class SnapshotsGetByDateRangeStep<T extends SnapshotsPlotContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        if (!context.startDate || !context.endDate) {
            context.snapshots = [];
            return;
        }

        progress.report({ message: l10n.t("Getting snapshots...") });

        const response: GetSnapshotsApiResponse = await getSnapshotsByDateRange(context.token, context.startDate, context.endDate);
        if (response.error) {
            context.snapshots = [];
            return;
        }
        context.snapshots = response.data?.snapshots;
    }

    shouldExecute(context: T): boolean {
        return !context.snapshots;
    }
}
