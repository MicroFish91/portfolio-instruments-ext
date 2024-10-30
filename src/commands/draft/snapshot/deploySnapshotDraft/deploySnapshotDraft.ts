import { l10n } from "vscode";
import { SnapshotDraftDeployConfirmStep } from "./SnapshotDraftDeployConfirmStep";
import { SnapshotDraftDeployStep } from "./SnapshotDraftDeployStep";
import { SnapshotDraftItem } from "../../../../tree/snapshots/draft/SnapshotDraftItem";
import { CommandContext } from "../../../registerCommand";
import { ext } from "../../../../extensionVariables";
import { SnapshotDraftDeployContext } from "./SnapshotDraftDeployContext";
import { nonNullValue, nonNullValueAndProp } from "../../../../utils/nonNull";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { Wizard } from "../../../../wizard/Wizard";

export async function deploySnapshotDraft(context: CommandContext, item: SnapshotDraftItem) {
    if (!ext.snapshotDraftFileSystem.hasSnapshotDraft(item.email)) {
        throw new Error(l10n.t('A snapshot draft must be active to deploy.'));
    }

    const wizardContext: SnapshotDraftDeployContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshotPayload: nonNullValue(ext.snapshotDraftFileSystem.parseSnapshotDraft(item.email)),
    };

    const wizard: Wizard<SnapshotDraftDeployContext> = new Wizard(wizardContext, {
        title: l10n.t('Deploy snapshot'),
        promptSteps: [
            new SnapshotDraftDeployConfirmStep(),
        ],
        executeSteps: [
            new SnapshotDraftDeployStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created snapshot dated "{0}"', nonNullValueAndProp(wizardContext.snapshot, 'snap_date')));
    ext.snapshotDraftFileSystem.discardSnapshotDraft(item);
}