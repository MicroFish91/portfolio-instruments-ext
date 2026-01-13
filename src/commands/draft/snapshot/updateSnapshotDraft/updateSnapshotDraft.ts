import { l10n } from "vscode";
import { SnapshotDraftUpdateStep } from "./SnapshotDraftUpdateStep";
import { CommandContext } from "../../../registerCommand";
import { SnapshotDataKeyDraftItem } from "../../../../tree/snapshots/draft/SnapshotDataKeyDraftItem";
import { SnapshotDraftUpdateContext } from "./SnapshotDraftUpdateContext";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue } from "../../../../utils/nonNull";
import { PromptStep } from "../../../../wizard/PromptStep";
import { SnapshotDateStep } from "../createSnapshotDraft/SnapshotDateStep";
import { SnapshotDescriptionStep } from "../createSnapshotDraft/SnapshotDescriptionStep";
import { BenchmarkListStep } from "../../../benchmarks/BenchmarkListStep";
import { Wizard } from "../../../../wizard/Wizard";
import { ext } from "../../../../extensionVariables";
import { SnapshotRebalanceThresholdStep } from "../SnapshotRebalanceThresholdStep";

export async function updateSnapshotDraft(context: CommandContext, item: SnapshotDataKeyDraftItem) {
    const wizardContext: SnapshotDraftUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        snapDate: item.key === 'snap_date' ? undefined : item.snapshotData.snap_date,
        snapDescription: item.key === 'description' ? undefined : item.snapshotData.description,
        benchmarkId: item.key === 'benchmark' ? undefined : item.snapshotData.benchmark_id,
        snapshotData: item.snapshotData,
    };

    const promptSteps: PromptStep<SnapshotDraftUpdateContext>[] = [];
    switch (item.key) {
        case 'snap_date':
            promptSteps.push(new SnapshotDateStep({ defaultDate: item.snapshotData.snap_date }));
            break;
        case 'description':
            promptSteps.push(new SnapshotDescriptionStep());
            break;
        case 'benchmark':
            promptSteps.push(new BenchmarkListStep({ suppressSkip: true }));
            break;
        case 'rebalance_threshold_pct':
            promptSteps.push(new SnapshotRebalanceThresholdStep({ defaultThresholdPct: item.snapshotData.rebalance_threshold_pct }));
            break;
        default:
    }

    const wizard: Wizard<SnapshotDraftUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update snapshot draft'),
        promptSteps,
        executeSteps: [
            new SnapshotDraftUpdateStep(item.parent),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Updated snapshot draft.'));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}