import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { SnapshotDataKeyItem } from "../../../tree/snapshots/snapshot/SnapshotDataKeyItem";
import { SnapshotUpdateContext } from "./SnapshotUpdateContext";
import { SnapshotDateStep } from "../../snapshotDraft/createSnapshotDraft/SnapshotDateStep";
import { SnapshotDescriptionStep } from "../../snapshotDraft/createSnapshotDraft/SnapshotDescriptionStep";
import { SnapshotUpdateStep } from "./SnapshotUpdateStep";
import { BenchmarkListStep } from "../../benchmarks/BenchmarkListStep";

export async function updateSnapshot(context: CommandContext, item: SnapshotDataKeyItem) {
    const wizardContext: SnapshotUpdateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        snapDate: item.key === 'snap_date' ? undefined : item.parent.snapshot.snap_date,
        snapDescription: item.key === 'description' ? undefined : item.parent.snapshot.description,
        benchmarkId: item.key === 'benchmark' ? undefined : item.parent.snapshot.benchmark_id,
        snapshot: item.parent.snapshot,
    };

    const wizard: Wizard<SnapshotUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update snapshot'),
        promptSteps: [
            new SnapshotDateStep(),
            new SnapshotDescriptionStep(),
            new BenchmarkListStep({ currentId: item.key === 'benchmark' ? undefined : item.parent.snapshot.benchmark_id, suppressSkip: true }),
        ],
        executeSteps: [
            new SnapshotUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Update to snapshot dated "{0}"', nonNullValueAndProp(wizardContext.updatedSnapshot, 'snap_date')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}