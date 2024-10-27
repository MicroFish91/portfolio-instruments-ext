import { l10n } from "vscode";
import { BenchmarkSettingsUpdateContext } from "./BenchmarkSettingsUpdateContext";
import { BenchmarkSettingsItem } from "../../../tree/settings/BenchmarkSettingsItem";
import { getAuthToken } from "../../../utils/tokenUtils";
import { nonNullValue } from "../../../utils/nonNull";
import { Wizard } from "../../../wizard/Wizard";
import { BenchmarkTargetStep } from "./BenchmarkTargetStep";
import { BenchmarkSettingsUpdateStep } from "./BenchmarkSettingsUpdateStep";
import { ext } from "../../../extensionVariables";

export async function updateBenchmarkSettings(context: BenchmarkSettingsUpdateContext, item: BenchmarkSettingsItem): Promise<void> {
    const wizardContext: BenchmarkSettingsUpdateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        settings: item.settings,
    };

    const wizard: Wizard<BenchmarkSettingsUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update benchmark target'),
        promptSteps: [
            new BenchmarkTargetStep({ suppressSkip: true }),
        ],
        executeSteps: [
            new BenchmarkSettingsUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update benchmark target.'));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}