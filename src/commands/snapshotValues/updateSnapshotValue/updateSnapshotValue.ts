import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { SnapshotValueUpdateContext } from "./SnapshotValueUpdateContext";
import { SnapshotValueItem } from "../../../tree/snapshots/snapshot/SnapshotValueItem";
import { AccountListStep } from "../../accounts/AccountListStep";
import { HoldingListStep } from "../../holdings/HoldingListStep";
import { SnapshotValueTotalStep } from "../createSnapshotValue/SnapshotValueTotalStep";
import { SnapshotValueSkipRebalanceStep } from "../createSnapshotValue/SnapshotValueSkipRebalanceStep";
import { SnapshotValueUpdateStep } from "./SnapshotValueUpdateStep";
import { ext } from "../../../extensionVariables";

export async function updateSnapshotValue(context: CommandContext, item: SnapshotValueItem) {
    const wizardContext: SnapshotValueUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshotId: item.snapshotValue.snap_id,
        snapshotValue: item.snapshotValue,
    };

    const wizard: Wizard<SnapshotValueUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create snapshot value'),
        promptSteps: [
            new AccountListStep({ currentId: wizardContext.snapshotValue.account_id }),
            new HoldingListStep({ currentId: wizardContext.snapshotValue.holding_id }),
            new SnapshotValueTotalStep(),
            new SnapshotValueSkipRebalanceStep(),
        ],
        executeSteps: [
            new SnapshotValueUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Updated snapshot value to new total "{0}".', nonNullValueAndProp(wizardContext.updatedSnapshotValue, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent.parent);
}