import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { HoldingCreateContext } from "./HoldingCreateContext";
import { HoldingsItem } from "../../../tree/holdings/HoldingsItem";
import { HoldingNameStep } from "./HoldingNameStep";
import { HoldingTypeListStep } from "./HoldingTypeListStep";
import { HoldingAssetCategoryStep } from "./HoldingAssetCategoryStep";
import { HoldingCreateStep } from "./HoldingCreateStep";
import { ext } from "../../../extensionVariables";

export async function createHolding(context: CommandContext, item: HoldingsItem): Promise<void> {
    const wizardContext: HoldingCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<HoldingCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a financial holding'),
        promptSteps: [
            new HoldingNameStep(),
            new HoldingAssetCategoryStep(),
            new HoldingTypeListStep(),
        ],
        executeSteps: [
            new HoldingCreateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created holding "{0}"', nonNullValueAndProp(wizardContext.holding, 'name')));
    ext.portfolioInstrumentsTdp.refresh(item);
}