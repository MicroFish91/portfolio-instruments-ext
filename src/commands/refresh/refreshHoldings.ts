import { HoldingsItem } from "../../tree/holdings/HoldingsItem";
import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";

export async function refreshHoldings(_context: CommandContext, node: HoldingsItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
