import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { HoldingDeleteContext } from "./HoldingDeleteContext";
import { HoldingItem } from "../../../tree/holdings/HoldingItem";
import { HoldingDeleteConfirmStep } from "./HoldingDeleteConfirmStep";
import { HoldingDeleteStep } from "./HoldingDeleteStep";
import { HoldingsItem } from "../../../tree/holdings/HoldingsItem";

export async function deleteHolding(context: CommandContext, item: HoldingItem): Promise<void> {
    const wizardContext: HoldingDeleteContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        holding: item.holding,
    };

    const wizard: Wizard<HoldingDeleteContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a financial account'),
        promptSteps: [
            new HoldingDeleteConfirmStep(),
        ],
        executeSteps: [
            new HoldingDeleteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted holding "{0}"', nonNullValueAndProp(wizardContext.holding, 'name')));
    ext.resourceCache.delete(HoldingsItem.generatePiExtHoldingsId(item.email));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}