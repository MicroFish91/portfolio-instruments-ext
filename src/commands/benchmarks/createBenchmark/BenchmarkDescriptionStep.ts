import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";

export class BenchmarkDescriptionStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.benchmarkDescription = (await context.ui.showInputBox({
            title: this.title,
            value: context.benchmark?.description,
            prompt: l10n.t('Enter benchmark description'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkDescription;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();
        if (!value) {
            return undefined;
        }

        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }
        return undefined;
    }
}