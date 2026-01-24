import { BenchmarksItem } from "../../tree/benchmarks/BenchmarksItem";
import { ext } from "../../extensionVariables";
import { CommandContext } from "../registerCommand";

export async function refreshBenchmarks(_context: CommandContext, node: BenchmarksItem): Promise<void> {
    ext.portfolioInstrumentsTdp.refresh(node);
}
