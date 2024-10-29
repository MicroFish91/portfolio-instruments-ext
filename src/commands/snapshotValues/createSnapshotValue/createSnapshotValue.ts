import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { SnapshotValuesItem } from "../../../tree/snapshots/snapshot/SnapshotValuesItem";
import { SnapshotValueCreateContext } from "./SnapshotValueCreateContext";
import { HoldingListStep } from "../../holdings/HoldingListStep";
import { AccountListStep } from "../../accounts/AccountListStep";
import { SnapshotValueTotalStep } from "./SnapshotValueTotalStep";
import { SnapshotValueCreateStep } from "./SnapshotValueCreateStep";
import { ext } from "../../../extensionVariables";
import { SnapshotValueSkipRebalanceStep } from "./SnapshotValueSkipRebalanceStep";

export async function createSnapshotValue(context: CommandContext, item: SnapshotValuesItem) {
    const wizardContext: SnapshotValueCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshotId: item.parent.snapshot.snap_id,
    };

    const wizard: Wizard<SnapshotValueCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create snapshot value'),
        promptSteps: [
            new AccountListStep(),
            new HoldingListStep(),
            new SnapshotValueTotalStep(),
            new SnapshotValueSkipRebalanceStep(),
        ],
        executeSteps: [
            new SnapshotValueCreateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created new snapshot value with total "{0}".', nonNullValueAndProp(wizardContext.snapshotValue, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}