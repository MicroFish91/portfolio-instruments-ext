import { l10n } from "vscode";
import { CommandContext } from "../../registerCommand";
import { SnapshotsItem } from "../../../tree/snapshots/SnapshotsItem";
import { SnapshotDraftCreateContext } from "./SnapshotDraftCreateContext";
import { getAuthToken } from "../../../utils/tokenUtils";
import { nonNullProp, nonNullValue } from "../../../utils/nonNull";
import { Wizard } from "../../../wizard/Wizard";
import { SnapshotDateStep } from "./SnapshotDateStep";
import { SnapshotDescriptionStep } from "./SnapshotDescriptionStep";
import { SnapshotDraftCreateStep } from "./SnapshotDraftCreateStep";
import { ext } from "../../../extensionVariables";
import { BenchmarkListStep } from "../../benchmarks/BenchmarkListStep";

export async function createSnapshotDraft(context: CommandContext, item: SnapshotsItem): Promise<void> {
    if (ext.snapshotDraftFileSystem.hasSnapshotDraft(item.email)) {
        throw new Error(l10n.t('An existing snapshot draft is already active for this email.'));
    }

    const wizardContext: SnapshotDraftCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        email: item.email,
        settings: item.settings,
    };

    const wizard: Wizard<SnapshotDraftCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a snapshot'),
        promptSteps: [
            new SnapshotDateStep(),
            new SnapshotDescriptionStep(),
            new BenchmarkListStep({ currentId: item.settings.benchmark_id }),
        ],
        executeSteps: [
            new SnapshotDraftCreateStep(item),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created snapshot draft dated "{0}"', nonNullProp(wizardContext, 'snapDate')));
}