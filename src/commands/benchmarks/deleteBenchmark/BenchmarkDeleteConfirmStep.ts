import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { BenchmarkDeleteContext } from "./BenchmarkDeleteContext";

export class BenchmarkDeleteConfirmStep<T extends BenchmarkDeleteContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const warning: string = l10n.t('Are you sure you want to delete benchmark "{0}"?', context.benchmark.name);
        await context.ui.showWarningMessage(warning, { modal: true }, l10n.t('Confirm'));
    }

    shouldPrompt(): boolean {
        return true;
    }
}