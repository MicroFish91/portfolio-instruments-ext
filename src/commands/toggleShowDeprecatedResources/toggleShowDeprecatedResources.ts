import { l10n, workspace, window } from "vscode";
import { ext } from "../../extensionVariables";

export async function toggleShowDeprecatedResources(): Promise<void> {
    const config = workspace.getConfiguration('portfolioInstruments');
    const currentValue = config.get<boolean>('showDeprecatedResources', false);
    
    await config.update('showDeprecatedResources', !currentValue, true);
    
    const newState = !currentValue ? l10n.t('shown') : l10n.t('hidden');
    window.showInformationMessage(l10n.t('Deprecated resources are now {0}', newState));
    
    ext.portfolioInstrumentsTdp.refresh();
}
