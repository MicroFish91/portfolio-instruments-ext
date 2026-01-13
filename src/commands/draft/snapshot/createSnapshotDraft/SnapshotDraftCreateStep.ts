import { Progress } from "vscode";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";
import { SnapshotsItem } from "../../../../tree/snapshots/SnapshotsItem";
import { ext } from "../../../../extensionVariables";
import { nonNullProp } from "../../../../utils/nonNull";
import { getSnapshot } from "../../../../sdk/snapshots/getSnapshot";
import { SnapshotValuesItem } from "../../../../tree/snapshots/snapshot/SnapshotValuesItem";
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
     */
    private convertToPayloadValues(context: T, snapshotId: number, snapshotValues: SnapshotValue[]): CreateSnapshotValuePayload[] {
        if (!snapshotId || !snapshotValues.length) {
            return snapshotValues;
        }

        const snapshotValueResourceModels: (SnapshotValue & GenericPiResourceModel)[] = snapshotValues.map(sv => convertToGenericPiResourceModel(sv, 'snap_val_id'));
        const orderedResourceIds: string[] = ext.context.globalState.get<string[]>(SnapshotValuesItem.generatePiExtSnapshotValuesOrderId(context.email, snapshotId)) ?? [];
        const orderedSnapshotValues: (SnapshotValue & GenericPiResourceModel)[] = orderResourcesByTargetIds(snapshotValueResourceModels, orderedResourceIds);

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
