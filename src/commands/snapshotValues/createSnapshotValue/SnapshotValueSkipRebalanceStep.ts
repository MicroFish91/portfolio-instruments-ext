import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { CommandContext } from "../../registerCommand";
import { SnapshotValue } from "../../../sdk/portfolio-instruments-api";

export class SnapshotValueSkipRebalanceStep<T extends CommandContext & { snapshotValue?: SnapshotValue, skipRebalance?: boolean }> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const items: PiQuickPickItem<boolean>[] = [
            {
                label: l10n.t('Yes'),
                description: context.snapshotValue?.skip_rebalance === false ? l10n.t('(current)') : l10n.t('(recommended)'),
                data: false,
            },
            {
                label: l10n.t('No'),
                description: context.snapshotValue?.skip_rebalance === true ? l10n.t('(current)') : undefined,
                data: true,
            },
        ];

        context.skipRebalance = (await context.ui.showQuickPick(items, {
            title: this.title,
            placeHolder: l10n.t('Include in rebalance calculations?'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return context.skipRebalance === undefined;
    }
}