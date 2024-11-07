import { l10n } from "vscode";
import { SnapshotsItem } from "../../tree/snapshots/SnapshotsItem";
import { CommandContext } from "../registerCommand";

export function incrementSnapshotPage(context: CommandContext, item: SnapshotsItem) {
    const page: number = item.incrementPage();
    context.ui.showInformationMessage(l10n.t('Updated snapshot pagination number to {0}', page));
}