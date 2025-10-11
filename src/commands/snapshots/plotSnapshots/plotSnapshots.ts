import * as vscode from 'vscode';
import { CommandContext } from '../../registerCommand';
import { SnapshotsPlotContext } from './SnapshotsPlotContext';
import { nonNullValue } from '../../../utils/nonNull';
import { getAuthToken } from '../../../utils/tokenUtils';
import { SnapshotsItem } from '../../../tree/snapshots/SnapshotsItem';
import { Wizard } from '../../../wizard/Wizard';
import { SnapshotsPlotStep } from './SnapshotsPlotStep';
import { SnapshotStartDatePromptStep } from './SnapshotsStartDatePromptStep';
import { SnapshotEndDatePromptStep } from './SnapshotEndDatePromptStep';
import { SnapshotsGetByDateRangeStep } from './SnapshotsGetByDateRangeStep';

export async function plotSnapshots(context: CommandContext, item: SnapshotsItem) {
    const wizardContext: SnapshotsPlotContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<SnapshotsPlotContext> = new Wizard(wizardContext, {
        title: vscode.l10n.t('Plot Snapshot Range'),
        promptSteps: [
            new SnapshotStartDatePromptStep(),
            new SnapshotEndDatePromptStep(),
        ],
        executeSteps: [
            new SnapshotsGetByDateRangeStep(),
            new SnapshotsPlotStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();
}
