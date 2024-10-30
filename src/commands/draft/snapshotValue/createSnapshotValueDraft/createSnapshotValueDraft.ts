import { l10n } from "vscode";
import { CommandContext } from "../../../registerCommand";
import { SnapshotValuesDraftItem } from "../../../../tree/snapshots/draft/SnapshotValuesDraftItem";
import { SnapshotValueDraftCreateContext } from "./SnapshotValueDraftCreateContext";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullProp, nonNullValue } from "../../../../utils/nonNull";
import { Wizard } from "../../../../wizard/Wizard";
import { AccountListStep } from "../../../accounts/AccountListStep";
import { HoldingListStep } from "../../../holdings/HoldingListStep";
import { SnapshotValueTotalStep } from "../../../snapshotValues/createSnapshotValue/SnapshotValueTotalStep";
import { SnapshotValueSkipRebalanceStep } from "../../../snapshotValues/createSnapshotValue/SnapshotValueSkipRebalanceStep";
import { ext } from "../../../../extensionVariables";
import { SnapshotValueDraftCreateStep } from "./SnapshotValueDraftCreateStep";

export async function createSnapshotValueDraft(context: CommandContext, item: SnapshotValuesDraftItem) {
    const wizardContext: SnapshotValueDraftCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<SnapshotValueDraftCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create snapshot value (draft)'),
        promptSteps: [
            new AccountListStep(),
            new HoldingListStep(),
            new SnapshotValueTotalStep(),
            new SnapshotValueSkipRebalanceStep(),
        ],
        executeSteps: [
            new SnapshotValueDraftCreateStep(item.parent),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created new snapshot value draft with total "{0}".', nonNullProp(wizardContext, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}