import { l10n } from "vscode";
import { CommandContext } from "../../registerCommand";
import { SnapshotsItem } from "../../../tree/snapshots/SnapshotsItem";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { getAuthToken } from "../../../utils/tokenUtils";
import { nonNullValue } from "../../../utils/nonNull";
import { Wizard } from "../../../wizard/Wizard";
import { ext } from "../../../extensionVariables";

export async function createSnapshotDraft(context: CommandContext, item: SnapshotsItem): Promise<void> {
    const wizardContext: SnapshotDraftCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<SnapshotDraftCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a snapshot'),
        promptSteps: [
            // Prompt snapshot date
            // Prompt snapshot description
            // Prompt snapshot benchmark 
        ],
        executeSteps: [
            // Create snapshot draft
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    ext.snapshotDraftFileSystem.createSnapshotDraft(
        item,
        { snap_date: '01/01/2001' },
    );
}