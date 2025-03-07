import { l10n } from "vscode";
import { CommandContext } from "../../../registerCommand";
import { SnapshotValueDraftItem } from "../../../../tree/snapshots/draft/SnapshotValueDraftItem";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue, nonNullValueAndProp } from "../../../../utils/nonNull";
import { Wizard } from "../../../../wizard/Wizard";
import { ext } from "../../../../extensionVariables";
import { SnapshotValueDraftUpdateContext } from "./SnapshotValueDraftUpdateContext";
import { SnapshotValueDraftUpdateStep } from "./SnapshotValueDraftUpdateStep";
import { SnapshotValueTotalStep } from "../../../snapshotValues/createSnapshotValue/SnapshotValueTotalStep";

export async function updateSnapshotValueAmountDraft(context: CommandContext, item: SnapshotValueDraftItem): Promise<void> {
    const wizardContext: SnapshotValueDraftUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        svIdx: item.svIdx,
        accountId: item.snapshotValue.account_id,
        holdingId: item.snapshotValue.holding_id,
        skipRebalance: item.snapshotValue.skip_rebalance,
        snapshotValueDraft: item.snapshotValue,
    };

    const wizard: Wizard<SnapshotValueDraftUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update snapshot value (draft)'),
        promptSteps: [
            new SnapshotValueTotalStep({ defaultValue: wizardContext.snapshotValueDraft.total }),
        ],
        executeSteps: [
            new SnapshotValueDraftUpdateStep(item.grandParent),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted snapshot value with total "{0}" (draft)', nonNullValueAndProp(wizardContext.snapshotValueDraft, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}