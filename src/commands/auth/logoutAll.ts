import { l10n } from "vscode";
import { hasAuthTokenRecord, removeAllAuthTokens } from "../../utils/tokenUtils";
import { CommandContext } from "../registerCommand";
import { ext } from "../../extensionVariables";

export async function logoutAll(context: CommandContext): Promise<void> {
    if (!await hasAuthTokenRecord()) {
        throw new Error(l10n.t('There are no active accounts to sign out.'));
    }

    await removeAllAuthTokens();
    void context.ui.showInformationMessage(l10n.t('Successfully signed out.'));
    ext.portfolioInstrumentsTdp.refresh();
}