import { AccountsItem } from "../../tree/accounts/AccountsItem";
import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";

export async function refreshAccounts(_context: CommandContext, node: AccountsItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
