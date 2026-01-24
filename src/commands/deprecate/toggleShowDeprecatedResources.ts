import { l10n, window } from "vscode";
import { ext } from "../../extensionVariables";
import { settingUtils } from "../../utils/settingUtils";

export async function toggleShowDeprecatedResources(): Promise<void> {
    const currentValue = settingUtils.getShowDeprecatedResources();
    
    await settingUtils.updateShowDeprecatedResources(!currentValue);
    
    const newState = !currentValue ? l10n.t('shown') : l10n.t('hidden');
    window.showInformationMessage(l10n.t('Deprecated resources are now {0}', newState));
    
    ext.portfolioInstrumentsTdp.refresh();
}
