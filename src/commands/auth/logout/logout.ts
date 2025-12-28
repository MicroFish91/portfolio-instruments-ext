import { l10n } from "vscode";
import { EmailItem } from "../../../tree/auth/EmailItem";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { removeAuthToken } from "../../../utils/tokenUtils";
import { BenchmarksItem } from "../../../tree/benchmarks/BenchmarksItem";
import { AccountsItem } from "../../../tree/accounts/AccountsItem";
import { HoldingsItem } from "../../../tree/holdings/HoldingsItem";

export async function logout(context: CommandContext, item: EmailItem): Promise<void> {
    await removeAuthToken(item.email);
    void context.ui.showInformationMessage(l10n.t('Successfully logged out of "{0}"', item.email));
    purgeUserResourceCaches(item.email);
    ext.portfolioInstrumentsTdp.refresh();
}

function purgeUserResourceCaches(email: string): void {
    ext.resourceCache.delete(EmailItem.generatePiExtUserId(email));
    ext.resourceCache.delete(BenchmarksItem.generatePiExtBenchmarksId(email));
    ext.resourceCache.delete(AccountsItem.generatePiExtAccountsId(email));
    ext.resourceCache.delete(HoldingsItem.generatePiExtHoldingsId(email));
}