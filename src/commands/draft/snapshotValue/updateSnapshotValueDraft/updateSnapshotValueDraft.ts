import { l10n } from "vscode";
import { CommandContext } from "../../../registerCommand";
import { SnapshotValueDraftItem } from "../../../../tree/snapshots/draft/SnapshotValueDraftItem";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue, nonNullValueAndProp } from "../../../../utils/nonNull";
import { Wizard } from "../../../../wizard/Wizard";
import { ext } from "../../../../extensionVariables";
import { SnapshotValueDraftUpdateContext } from "./SnapshotValueDraftUpdateContext";
import { AccountListStep } from "../../../accounts/AccountListStep";
import { HoldingListStep } from "../../../holdings/HoldingListStep";
import { SnapshotValueDraftUpdateStep } from "./SnapshotValueDraftUpdateStep";
import { SnapshotValueTotalStep } from "../../../snapshotValues/createSnapshotValue/SnapshotValueTotalStep";
import { SnapshotValueSkipRebalanceStep } from "../../../snapshotValues/createSnapshotValue/SnapshotValueSkipRebalanceStep";

export async function updateSnapshotValueDraft(context: CommandContext, item: SnapshotValueDraftItem): Promise<void> {
    const wizardContext: SnapshotValueDraftUpdateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        svIdx: item.svIdx,
        snapshotValueDraft: item.snapshotValue,
    };

    const wizard: Wizard<SnapshotValueDraftUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update snapshot value (draft)'),
        promptSteps: [
            new AccountListStep({ currentId: wizardContext.snapshotValueDraft.account_id }),
            new HoldingListStep({ currentId: wizardContext.snapshotValueDraft.holding_id }),
            new SnapshotValueTotalStep({ defaultValue: wizardContext.snapshotValueDraft.total }),
            new SnapshotValueSkipRebalanceStep(),
        ],
        executeSteps: [
            new SnapshotValueDraftUpdateStep(item.parent),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted snapshot value with total "{0}" (draft)', nonNullValueAndProp(wizardContext.snapshotValueDraft, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}