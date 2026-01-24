import { SnapshotItem } from "../../tree/snapshots/snapshot/SnapshotItem";
import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";

export async function refreshSnapshot(_context: CommandContext, node: SnapshotItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
