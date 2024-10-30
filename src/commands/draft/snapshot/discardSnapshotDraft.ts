import { ext } from "../../../extensionVariables";
import { SnapshotDraftItem } from "../../../tree/snapshots/draft/SnapshotDraftItem";
import { CommandContext } from "../../registerCommand";

export async function discardSnapshotDraft(_: CommandContext, item: SnapshotDraftItem) {
    ext.snapshotDraftFileSystem.discardSnapshotDraft(item);
}