import { ext } from "../extensionVariables";
import { PiExtTreeItem } from "../tree/PiExtTreeDataProvider";
import { CommandContext } from "./registerCommand";

export async function refresh(_context: CommandContext): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh();
}

export async function refreshNode(_context: CommandContext, node: PiExtTreeItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
