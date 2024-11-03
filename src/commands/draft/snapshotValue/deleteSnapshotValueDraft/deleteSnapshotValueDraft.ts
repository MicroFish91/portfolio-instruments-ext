import { l10n } from "vscode";
import { CommandContext } from "../../../registerCommand";
import { SnapshotValueDraftItem } from "../../../../tree/snapshots/draft/SnapshotValueDraftItem";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue, nonNullValueAndProp } from "../../../../utils/nonNull";
import { SnapshotValueDraftDeleteContext } from "./SnapshotValueDraftDeleteContext";
import { Wizard } from "../../../../wizard/Wizard";
import { SnapshotValueDeleteConfirmStep } from "./SnapshotValueDeleteConfirmStep";
import { SnapshotValueDraftDeleteStep } from "./SnapshotValueDraftDeleteStep";
import { ext } from "../../../../extensionVariables";

export async function deleteSnapshotValueDraft(context: CommandContext, item: SnapshotValueDraftItem): Promise<void> {
    const wizardContext: SnapshotValueDraftDeleteContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        svIdx: item.svIdx,
        snapshotValueDraft: item.snapshotValue,
    };

    const wizard: Wizard<SnapshotValueDraftDeleteContext> = new Wizard(wizardContext, {
        title: l10n.t('Delete a snapshot value (draft)'),
        promptSteps: [
            new SnapshotValueDeleteConfirmStep(),
        ],
        executeSteps: [
            new SnapshotValueDraftDeleteStep(item.parent),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted snapshot value with total "{0}" (draft)', nonNullValueAndProp(wizardContext.snapshotValueDraft, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}