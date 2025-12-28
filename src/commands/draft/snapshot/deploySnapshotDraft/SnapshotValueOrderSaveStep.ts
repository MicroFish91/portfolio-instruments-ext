import { SnapshotDraftDeployContext } from "./SnapshotDraftDeployContext";
import { ExecuteStep } from "../../../../wizard/ExecuteStep";
import { SnapshotValuesItem } from "../../../../tree/snapshots/snapshot/SnapshotValuesItem";
import { nonNullProp, nonNullValueAndProp } from "../../../../utils/nonNull";
import { ext } from "../../../../extensionVariables";
import { CreateSnapshotValuePayload, SnapshotValue } from "../../../../sdk/portfolio-instruments-api";

type SerializedId = string;
type ResourceId = string;

export class SnapshotValueOrderSaveStep<T extends SnapshotDraftDeployContext> extends ExecuteStep<T> {
    priority: 210;

    async execute(context: T) {
        const svMap: Map<SerializedId, ResourceId | undefined> = new Map();

        // Start by adding all serialized values in the correct order, they will not have target resource ids yet
        for (const sv of context.snapshotPayload.snapshot_values) {
            svMap.set(serializeResource(sv), undefined);
        }

        // Map the resource IDs using serialization
        for (const sv of nonNullProp(context, 'snapshotValues')) {
            svMap.set(serializeResource(sv), String(sv.snap_val_id));
        }

        const orderedIds: string[] = Array.from(svMap.values()).filter(sv => sv !== undefined);
        const svOrderId: string = SnapshotValuesItem.generatePiExtSnapshotValuesOrderId(context.email, nonNullValueAndProp(context.snapshot, 'snap_id'));
        await ext.context.globalState.update(svOrderId, orderedIds);
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshot && !!context.snapshotValues;
    }
}

function serializeResource(resource: SnapshotValue | CreateSnapshotValuePayload): SerializedId {
    return `${resource.account_id}/${resource.holding_id}/${resource.total}`;
}