import { l10n } from "vscode";
import { getAuthToken } from "../../../utils/tokenUtils";
import { nonNullProp, nonNullValue } from "../../../utils/nonNull";
import { Wizard } from "../../../wizard/Wizard";
import { ext } from "../../../extensionVariables";
import { SettingsItem } from "../../../tree/settings/SettingsItem";
import { RebalanceSettingsUpdateContext } from "./RebalanceSettingsUpdateContext";
import { RebalanceSettingsItem } from "../../../tree/settings/RebalanceSettingsItem";
import { RebalanceSettingsPromptStep } from "./RebalanceSettingsPromptStep";
import { RebalanceSettingsUpdateStep } from "./RebalanceSettingsUpdateStep";

export async function updateRebalanceSettings(context: RebalanceSettingsUpdateContext, item: RebalanceSettingsItem): Promise<void> {
    const wizardContext: RebalanceSettingsUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        settings: item.settings,
    };

    const wizard: Wizard<RebalanceSettingsUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update benchmark target'),
        promptSteps: [
            new RebalanceSettingsPromptStep(),
        ],
        executeSteps: [
            new RebalanceSettingsUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update rebalance threshold to {0}%.', nonNullProp(wizardContext, 'rebalanceThreshold')));
    ext.resourceCache.delete(SettingsItem.generatePiExtSettingsId(wizardContext.email));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}