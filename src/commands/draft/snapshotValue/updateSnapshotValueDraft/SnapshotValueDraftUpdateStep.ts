import { l10n, Progress } from "vscode";
import { ext } from "../../../../extensionVariables";
import { SnapshotDraftItem } from "../../../../tree/snapshots/draft/SnapshotDraftItem";
import { SnapshotValueDraftUpdateContext } from "./SnapshotValueDraftUpdateContext";
import { nonNullProp } from "../../../../utils/nonNull";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../../../sdk/portfolio-instruments-api";

export class SnapshotValueDraftUpdateStep<T extends SnapshotValueDraftUpdateContext> {
    priority: 200;
    constructor(readonly item: SnapshotDraftItem) { }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>): Promise<void> {
        progress.report({ message: l10n.t("Updating snapshot value (draft)...") });

        const snapshotDraft: CreateSnapshotPayload | undefined = ext.snapshotDraftFileSystem.parseSnapshotDraft(this.item.email);
        let snapshotValues: CreateSnapshotValuePayload[] = snapshotDraft?.snapshot_values ?? [];

        snapshotValues[context.svIdx] = {
            account_id: nonNullProp(context, 'accountId'),
            holding_id: nonNullProp(context, 'holdingId'),
            total: nonNullProp(context, 'total'),
            skip_rebalance: context.skipRebalance,
        };

        await ext.snapshotDraftFileSystem.updateSnapshotValuesDraft(this.item, snapshotValues);
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshotValueDraft && context.svIdx !== undefined;
    }
}
