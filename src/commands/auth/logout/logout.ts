import { l10n } from "vscode";
import { EmailItem } from "../../../tree/auth/EmailItem";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { removeAuthToken } from "../../../utils/tokenUtils";

export async function logout(context: CommandContext, item: EmailItem): Promise<void> {
    await removeAuthToken(item.email);
    void context.ui.showInformationMessage(l10n.t('Successfully logged out of "{0}"', item.email));
    ext.portfolioInstrumentsTdp.refresh();
}