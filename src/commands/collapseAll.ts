import { commands } from "vscode";
import { CommandContext } from "./registerCommand";

export async function collapseAll(_context: CommandContext): Promise<void> {
    await commands.executeCommand('workbench.actions.treeView.portfolioInstruments.main.collapseAll');
}
