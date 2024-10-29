import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { SnapshotValueUpdateContext } from "./SnapshotValueUpdateContext";
import { updateSnapshotValue, UpdateSnapshotValueApiResponse } from "../../../sdk/snapshotValue/updateSnapshotValue";

export class SnapshotValueUpdateStep<T extends SnapshotValueUpdateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Updating snapshot value...") });

        const response: UpdateSnapshotValueApiResponse = await updateSnapshotValue(nonNullProp(context, 'token'), context.snapshotId, context.snapshotValue.snap_val_id, {
            account_id: nonNullProp(context, 'accountId'),
            holding_id: nonNullProp(context, 'holdingId'),
            total: nonNullProp(context, 'total'),
            skip_rebalance: context.skipRebalance,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.updatedSnapshotValue = response.data?.snapshot_value;
    }

    shouldExecute(context: T): boolean {
        return !context.updatedSnapshotValue;
    }
}
