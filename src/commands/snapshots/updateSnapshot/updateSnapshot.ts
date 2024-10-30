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

export async function updateSnapshot(context: CommandContext, item: SnapshotDataKeyItem) {
    const wizardContext: SnapshotUpdateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        snapDate: item.key === 'snap_date' ? undefined : item.parent.snapshot.snap_date,
        snapDescription: item.key === 'description' ? undefined : item.parent.snapshot.description,
        benchmarkId: item.key === 'benchmark' ? undefined : item.parent.snapshot.benchmark_id,
        snapshot: item.parent.snapshot,
    };

    const promptSteps: PromptStep<SnapshotUpdateContext>[] = [];
    switch (item.key) {
        case 'snap_date':
            promptSteps.push(new SnapshotDateStep({ defaultDate: item.parent.snapshot.snap_date }));
            break;
        case 'description':
            promptSteps.push(new SnapshotDescriptionStep());
            break;
        case 'benchmark':
            promptSteps.push(new BenchmarkListStep({ suppressSkip: true }));
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