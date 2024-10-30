import { l10n, Progress } from "vscode";
import { SnapshotValueDraftCreateContext } from "./SnapshotValueDraftCreateContext";
import { ext } from "../../../../extensionVariables";
import { SnapshotDraftItem } from "../../../../tree/snapshots/draft/SnapshotDraftItem";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../../../sdk/snapshots/createSnapshot";
import { nonNullProp } from "../../../../utils/nonNull";

export class SnapshotValueDraftCreateStep<T extends SnapshotValueDraftCreateContext> {
    priority: 200;

    constructor(readonly item: SnapshotDraftItem) { }

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Creating snapshot value (draft)...") });

        const snapshotDraft: CreateSnapshotPayload | undefined = ext.snapshotDraftFileSystem.parseSnapshotDraft(this.item.email);
        const snapshotValues: CreateSnapshotValuePayload[] = snapshotDraft?.snapshot_values ?? [];
        snapshotValues.push({
            account_id: nonNullProp(context, 'accountId'),
            holding_id: nonNullProp(context, 'holdingId'),
            total: nonNullProp(context, 'total'),
            skip_rebalance: context.skipRebalance,
        });

        await ext.snapshotDraftFileSystem.updateSnapshotValuesDraft(this.item, snapshotValues);
    }

    shouldExecute(): boolean {
        return true;
    }
}
