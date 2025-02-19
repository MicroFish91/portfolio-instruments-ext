import { Progress } from "vscode";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";
import { SnapshotsItem } from "../../../../tree/snapshots/SnapshotsItem";
import { ext } from "../../../../extensionVariables";
import { nonNullProp } from "../../../../utils/nonNull";
import { getSnapshot } from "../../../../sdk/snapshots/getSnapshot";
import { Snapshot, SnapshotValue } from "../../../../sdk/types/snapshots";
import { CreateSnapshotValuePayload } from "../../../../sdk/snapshotValue/createSnapshotValue";
import { settingUtils } from "../../../../utils/settingUtils";
import { GetSnapshotsApiResponse } from "../../../../sdk/snapshots/getSnapshots";
import { SnapshotValuesItem } from "../../../../tree/snapshots/snapshot/SnapshotValuesItem";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds } from "../../../../tree/reorder";

export class SnapshotDraftCreateStep<T extends SnapshotDraftCreateContext> extends ExecuteStep<T> {
    priority: 200;

    constructor(readonly parentItem: SnapshotsItem) {
        super();
    }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating snapshot draft..." });

        const snapDate: string = nonNullProp(context, 'snapDate');
        const snapshot: Snapshot | undefined = await this.tryGetMostRecentSnapshot(context, snapDate);
        const snapshotValues: SnapshotValue[] = snapshot ? ((await getSnapshot(context.token, snapshot.snap_id)).data?.snapshot_values ?? []) : [];

        ext.snapshotDraftFileSystem.createSnapshotDraft(
            this.parentItem,
            {
                snap_date: snapDate,
                description: context.snapDescription,
                benchmark_id: context.benchmarkId,
            },
            this.convertToPayloadValues(context, snapshot?.snap_id ?? 0, snapshotValues),
        );
    }

    shouldExecute(context: T): boolean {
        return !ext.snapshotDraftFileSystem.hasSnapshotDraft(context.email);
    }

    private async tryGetMostRecentSnapshot(context: T, snapshotDate: string): Promise<Snapshot | undefined> {
        const responseJson = await fetch(`${settingUtils.getApiEndpointBaseUrl()}/api/v1/snapshots?snap_date_upper=${snapshotDate}&order_date_by=DESC&page_size=1`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${context.token}`,
            },
        });
        const response = await responseJson.json() as GetSnapshotsApiResponse;
        return response.data?.snapshots?.[0];
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
