import { SnapshotsItem } from "../../tree/snapshots/SnapshotsItem";
import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";

export async function refreshSnapshots(_context: CommandContext, node: SnapshotsItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
