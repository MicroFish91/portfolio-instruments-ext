import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { AccountDeleteContext } from "./AccountDeleteContext";

export class AccountDeleteConfirmStep<T extends AccountDeleteContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Are you sure you want to delete account "{0}"?', context.account.name);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}