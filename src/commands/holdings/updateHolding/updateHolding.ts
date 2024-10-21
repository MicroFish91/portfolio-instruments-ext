import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { HoldingItem } from "../../../tree/holdings/HoldingItem";
import { HoldingUpdateContext } from "./HoldingUpdateContext";
import { HoldingNameStep } from "../createHolding/HoldingNameStep";
import { HoldingAssetCategoryStep } from "../createHolding/HoldingAssetCategoryStep";
import { HoldingTypeListStep } from "../createHolding/HoldingTypeListStep";
import { HoldingUpdateStep } from "./HoldingUpdateStep";

export async function updateHolding(context: CommandContext, item: HoldingItem): Promise<void> {
    const wizardContext: HoldingUpdateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        holding: item.holding,
    };

    const wizard: Wizard<HoldingUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update financial holding'),
        promptSteps: [
            new HoldingNameStep(),
            new HoldingAssetCategoryStep(),
            new HoldingTypeListStep(),
        ],
        executeSteps: [
            new HoldingUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update holding "{0}"', nonNullValueAndProp(wizardContext.updatedHolding, 'name')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}