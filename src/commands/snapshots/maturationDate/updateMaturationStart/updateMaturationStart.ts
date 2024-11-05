import { l10n } from "vscode";
import { nonNullProp, nonNullValue } from "../../../../utils/nonNull";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { Wizard } from "../../../../wizard/Wizard";
import { CommandContext } from "../../../registerCommand";
import { ext } from "../../../../extensionVariables";
import { MaturationStartUpdateContext } from "./MaturationStartUpdateContext";
import { SnapshotMaturationStartItem } from "../../../../tree/snapshots/snapshot/dashboard/maturationDate/SnapshotMaturationStartItem";
import { MaturationDatePromptStep } from "../MaturationDatePromptStep";
import { MaturationStartUpdateStep } from "./MaturationStartUpdateStep";

export async function updateMaturationStart(context: CommandContext, item: SnapshotMaturationStartItem) {
    const wizardContext: MaturationStartUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshotId: item.snapshotData.snap_id,
    };

    const wizard: Wizard<MaturationStartUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update maturation start date'),
        promptSteps: [
            new MaturationDatePromptStep({
                default: SnapshotMaturationStartItem.getMaturationStart(wizardContext.email, wizardContext.snapshotId),
                prompt: l10n.t('Enter maturation start date (mm/dd/yyyy)'),
            }),
        ],
        executeSteps: [
            new MaturationStartUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update maturation start date to "{0}"', nonNullProp(wizardContext, 'maturationDate')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}