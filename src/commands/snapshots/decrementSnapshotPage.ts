import { l10n } from "vscode";
import { SnapshotsItem } from "../../tree/snapshots/SnapshotsItem";
import { CommandContext } from "../registerCommand";

export function decrementSnapshotPage(context: CommandContext, item: SnapshotsItem) {
    const page: number = item.decrementPage();
    context.ui.showInformationMessage(l10n.t('Updated snapshot pagination number to {0}', page));
}