import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { SnapshotValueCreateContext } from "./SnapshotValueCreateContext";
import { createSnapshotValue, CreateSnapshotValueApiResponse } from "../../../sdk/snapshotValue/createSnapshotValue";

export class SnapshotValueCreateStep<T extends SnapshotValueCreateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Creating snapshot value...") });

        const response: CreateSnapshotValueApiResponse = await createSnapshotValue(nonNullProp(context, 'token'), context.snapshotId, {
            account_id: nonNullProp(context, 'accountId'),
            holding_id: nonNullProp(context, 'holdingId'),
            total: nonNullProp(context, 'total'),
            skip_rebalance: false,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.snapshotValue = response.data?.snapshot_value;
    }

    shouldExecute(context: T): boolean {
        return !context.snapshotValue;
    }
}
