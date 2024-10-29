import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { SnapshotValueCreateContext } from "./SnapshotValueCreateContext";
import { PiQuickPickItem } from "../../../wizard/UserInterface";

export class SnapshotValueSkipRebalanceStep<T extends SnapshotValueCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const items: PiQuickPickItem<boolean>[] = [
            {
                label: l10n.t('Yes'),
                data: false,
            },
            {
                label: l10n.t('No'),
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