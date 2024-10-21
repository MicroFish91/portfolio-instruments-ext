import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { HoldingDeleteContext } from "./HoldingDeleteContext";

export class HoldingDeleteConfirmStep<T extends HoldingDeleteContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Are you sure you want to delete holding "{0}"?', context.holding.name);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}