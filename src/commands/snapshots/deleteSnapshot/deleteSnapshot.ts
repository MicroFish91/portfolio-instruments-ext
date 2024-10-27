import { l10n } from "vscode";
import { SnapshotItem } from "../../../tree/snapshots/SnapshotItem";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { SnapshotDeleteContext } from "./SnapshotDeleteContext";
import { ext } from "../../../extensionVariables";
import { SnapshotDeleteConfirmStep } from "./SnapshotDeleteConfirmStep";
import { SnapshotDeleteStep } from "./SnapshotDeleteStep";

export async function deleteSnapshot(context: CommandContext, item: SnapshotItem) {
    const wizardContext: SnapshotDeleteContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshot: item.snapshot,
    };

    const wizard: Wizard<SnapshotDeleteContext> = new Wizard(wizardContext, {
        title: l10n.t('Delete snapshot'),
        promptSteps: [
            new SnapshotDeleteConfirmStep(),
        ],
        executeSteps: [
            new SnapshotDeleteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted snapshot dated "{0}"', nonNullValueAndProp(wizardContext.snapshot, 'snap_date')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}