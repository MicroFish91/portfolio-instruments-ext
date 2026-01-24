import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";
import { PiExtTreeItem } from "../../tree/PiExtTreeDataProvider";

export async function refresh(_context: CommandContext): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh();
}

export async function refreshNode(_context: CommandContext, node: PiExtTreeItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
