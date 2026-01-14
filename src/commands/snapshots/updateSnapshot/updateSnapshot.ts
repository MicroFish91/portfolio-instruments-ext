import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { SnapshotDataKeyItem } from "../../../tree/snapshots/snapshot/SnapshotDataKeyItem";
import { SnapshotUpdateContext } from "./SnapshotUpdateContext";
import { SnapshotUpdateStep } from "./SnapshotUpdateStep";
import { BenchmarkListStep } from "../../benchmarks/BenchmarkListStep";
import { PromptStep } from "../../../wizard/PromptStep";
import { SnapshotDateStep } from "../../draft/snapshot/createSnapshotDraft/SnapshotDateStep";
import { SnapshotDescriptionStep } from "../../draft/snapshot/createSnapshotDraft/SnapshotDescriptionStep";
import { SnapshotRebalanceThresholdStep } from "../../draft/snapshot/SnapshotRebalanceThresholdStep";
import { snapshotBenchmarkKey, snapshotDateKey, snapshotDescriptionKey, snapshotRebalanceThresholdKey } from "../../../tree/snapshots/snapshot/SnapshotDataItem";

export async function updateSnapshot(context: CommandContext, item: SnapshotDataKeyItem) {
    const wizardContext: SnapshotUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        snapDate: item.key === snapshotDateKey ? undefined : item.parent.snapshot.snap_date,
        snapDescription: item.key === snapshotDescriptionKey ? undefined : item.parent.snapshot.description,
        benchmarkId: item.key === snapshotBenchmarkKey ? undefined : item.parent.snapshot.benchmark_id,
        rebalanceThresholdPct: item.key === snapshotRebalanceThresholdKey ? undefined : item.parent.snapshot.rebalance_threshold_pct,
        snapshot: item.parent.snapshot,
    };

    const promptSteps: PromptStep<SnapshotUpdateContext>[] = [];
    switch (item.key) {
        case snapshotDateKey:
            promptSteps.push(new SnapshotDateStep({ defaultDate: item.parent.snapshot.snap_date }));
            break;
        case snapshotDescriptionKey:
            promptSteps.push(new SnapshotDescriptionStep());
            break;
        case snapshotBenchmarkKey:
            promptSteps.push(new BenchmarkListStep({ recommendedId: item.parent.snapshot.benchmark_id, suppressSkip: true }));
            break;
        case snapshotRebalanceThresholdKey:
            promptSteps.push(new SnapshotRebalanceThresholdStep({ defaultThresholdPct: item.parent.snapshot.rebalance_threshold_pct }));
            break;
        default:
    }

    const wizard: Wizard<SnapshotUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update snapshot'),
        promptSteps,
        executeSteps: [
            new SnapshotUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update to snapshot dated "{0}"', nonNullValueAndProp(wizardContext.updatedSnapshot, 'snap_date')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}