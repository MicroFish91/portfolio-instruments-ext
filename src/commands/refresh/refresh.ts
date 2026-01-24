import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";

export async function refresh(_context: CommandContext): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh();
}
