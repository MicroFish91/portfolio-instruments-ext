import { l10n } from "vscode";
import { nonNullProp, nonNullValue } from "../../../../utils/nonNull";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { Wizard } from "../../../../wizard/Wizard";
import { CommandContext } from "../../../registerCommand";
import { ext } from "../../../../extensionVariables";
import { MaturationDatePromptStep } from "../MaturationDatePromptStep";
import { MaturationUpdateContext } from "../MaturationUpdateContext";
import { SnapshotMaturationEndItem } from "../../../../tree/snapshots/snapshot/dashboard/maturationDate/SnapshotMaturationEndItem";
import { MaturationEndUpdateStep } from "./MaturationEndUpdateStep";

export async function updateMaturationEnd(context: CommandContext, item: SnapshotMaturationEndItem) {
    const wizardContext: MaturationUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        snapshotId: item.snapshotData.snap_id,
    };

    const wizard: Wizard<MaturationUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update maturation end date'),
        promptSteps: [
            new MaturationDatePromptStep({
                default: SnapshotMaturationEndItem.getMaturationEnd(wizardContext.email, wizardContext.snapshotId),
                prompt: l10n.t('Enter maturation end date (mm/dd/yyyy)'),
            }),
        ],
        executeSteps: [
            new MaturationEndUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update maturation end date to "{0}"', nonNullProp(wizardContext, 'maturationDate')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}