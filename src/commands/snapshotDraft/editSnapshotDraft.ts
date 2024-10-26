import { ext } from "../../extensionVariables";
import { SnapshotDraftItem } from "../../tree/snapshots/draft/SnapshotDraftItem";
import { CommandContext } from "../registerCommand";

export async function editSnapshotDraft(_: CommandContext, item: SnapshotDraftItem) {
    ext.snapshotDraftFileSystem.editSnapshotDraft(item);
}