import { l10n } from "vscode";
import { CommandContext } from "../../registerCommand";
import { SnapshotsItem } from "../../../tree/snapshots/SnapshotsItem";
import { SnapshotCreateContext } from "./SnapshotCreateContext";
import { getAuthToken } from "../../../utils/tokenUtils";
import { nonNullValue } from "../../../utils/nonNull";
import { Wizard } from "../../../wizard/Wizard";
import { ext } from "../../../extensionVariables";

export async function createSnapshot(context: CommandContext, item: SnapshotsItem): Promise<void> {
    const wizardContext: SnapshotCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<SnapshotCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a snapshot'),
        promptSteps: [
            //
        ],
        executeSteps: [
            //
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    ext.snapshotDraftFileSystem.createSnapshotDraft(
        item,
        { snap_date: '01/01/2001' },
    );
}