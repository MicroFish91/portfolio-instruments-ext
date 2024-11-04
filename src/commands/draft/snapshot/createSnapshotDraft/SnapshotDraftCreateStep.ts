import { Progress } from "vscode";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";
import { SnapshotsItem } from "../../../../tree/snapshots/SnapshotsItem";
import { ext } from "../../../../extensionVariables";
import { nonNullProp } from "../../../../utils/nonNull";
import { getSnapshotLatest } from "../../../../sdk/snapshots/getSnapshot";
import { SnapshotValue } from "../../../../sdk/types/snapshots";
import { CreateSnapshotValuePayload } from "../../../../sdk/snapshotValue/createSnapshotValue";

export class SnapshotDraftCreateStep<T extends SnapshotDraftCreateContext> extends ExecuteStep<T> {
    priority: 200;

    constructor(readonly parentItem: SnapshotsItem) {
        super();
    }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating snapshot draft..." });

        ext.snapshotDraftFileSystem.createSnapshotDraft(
            this.parentItem,
            {
                snap_date: nonNullProp(context, 'snapDate'),
                description: context.snapDescription,
                benchmark_id: context.benchmarkId,
            },
            this.convertToPayloadValues((await getSnapshotLatest(context.token)).data?.snapshot_values ?? []),
        );
    }

    shouldExecute(context: T): boolean {
        return !ext.snapshotDraftFileSystem.hasSnapshotDraft(context.email);
    }

    /**
     * We only need to carry over the values that are required for creating new snapshot values.
     * Other metadata will look confusing when shown in the draft format since it is not used for creating new resources.
     */
    private convertToPayloadValues(snapshotValues: SnapshotValue[]): CreateSnapshotValuePayload[] {
        const simplifiedPayloads: CreateSnapshotValuePayload[] = [];
        for (const sv of snapshotValues) {
            simplifiedPayloads.push({
                account_id: sv.account_id,
                holding_id: sv.holding_id,
                total: sv.total,
                skip_rebalance: sv.skip_rebalance,
            });
        }
        return simplifiedPayloads;
    }
}
