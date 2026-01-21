import { Progress } from "vscode";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";
import { SnapshotsItem } from "../../../../tree/snapshots/SnapshotsItem";
import { ext } from "../../../../extensionVariables";
import { nonNullProp } from "../../../../utils/nonNull";
import { getSnapshot } from "../../../../sdk/snapshots/getSnapshot";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds } from "../../../../tree/reorder";
import { CreateSnapshotValuePayload, Snapshot, SnapshotValue } from "../../../../sdk/portfolio-instruments-api";

export class SnapshotDraftCreateStep<T extends SnapshotDraftCreateContext> extends ExecuteStep<T> {
    priority: 200;

    constructor(readonly parentItem: SnapshotsItem) {
        super();
    }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating snapshot draft..." });

        const snapDate: string = nonNullProp(context, 'snapDate');
        const snapshot: Snapshot | undefined = context.mostRecentSnapshot;
        const snapshotValues: SnapshotValue[] = snapshot ? ((await getSnapshot(context.token, snapshot.snap_id)).data?.snapshot_values ?? []) : [];

        ext.snapshotDraftFileSystem.createSnapshotDraft(
            this.parentItem,
            {
                snap_date: snapDate,
                description: context.snapDescription,
                benchmark_id: context.benchmarkId,
                rebalance_threshold_pct: context.rebalanceThresholdPct,
            },
            this.convertToPayloadValues(context, snapshot?.snap_id ?? 0, snapshotValues),
        );
    }

    shouldExecute(context: T): boolean {
        return !ext.snapshotDraftFileSystem.hasSnapshotDraft(context.email);
    }

    /**
     * We only need to carry over the values that are required for creating new snapshot values.
     * Other metadata will look confusing when shown in the draft format since it is not used for creating new resources.
     * 
     * Uses server-side value_order from the snapshot if available.
     */
    private convertToPayloadValues(context: T, snapshotId: number, snapshotValues: SnapshotValue[]): CreateSnapshotValuePayload[] {
        if (!snapshotId || !snapshotValues.length) {
            return snapshotValues;
        }

        // Get the snapshot to access server-side value_order
        const snapshot: Snapshot | undefined = context.mostRecentSnapshot;
        const snapshotValueResourceModels: (SnapshotValue & GenericPiResourceModel)[] = snapshotValues.map(sv => convertToGenericPiResourceModel(sv, 'snap_val_id'));

        // Use server-side value_order if available, otherwise use default order
        let orderedSnapshotValues: (SnapshotValue & GenericPiResourceModel)[];
        if (snapshot?.value_order && snapshot.value_order.length > 0) {
            const orderedResourceIds = snapshot.value_order.map(id => String(id));
            orderedSnapshotValues = orderResourcesByTargetIds(snapshotValueResourceModels, orderedResourceIds);
        } else {
            orderedSnapshotValues = snapshotValueResourceModels;
        }

        const simplifiedPayloads: CreateSnapshotValuePayload[] = [];
        for (const sv of orderedSnapshotValues) {
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
