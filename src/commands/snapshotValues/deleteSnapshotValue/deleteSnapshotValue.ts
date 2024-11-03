import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { SnapshotValueItem } from "../../../tree/snapshots/snapshot/SnapshotValueItem";
import { SnapshotValueDeleteContext } from "./SnapshotValueDeleteContext";
import { SnapshotValueDeleteConfirmStep } from "./SnapshotValueDeleteConfirmStep";
import { SnapshotValueDeleteStep } from "./SnapshotValueDeleteStep";

export async function deleteSnapshotValue(context: CommandContext, item: SnapshotValueItem): Promise<void> {
    const wizardContext: SnapshotValueDeleteContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshotId: item.parent.snapshot.snap_id,
        snapshotValue: item.snapshotValue,
    };

    const wizard: Wizard<SnapshotValueDeleteContext> = new Wizard(wizardContext, {
        title: l10n.t('Delete snapshot value'),
        promptSteps: [
            new SnapshotValueDeleteConfirmStep(),
        ],
        executeSteps: [
            new SnapshotValueDeleteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted snapshot value with total "{0}"', nonNullValueAndProp(wizardContext.snapshotValue, 'total')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}