import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";

export class BenchmarkNameStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.benchmarkName = (await context.ui.showInputBox({
            title: this.title,
            value: context.benchmark?.name,
            prompt: l10n.t('Enter benchmark name'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkName;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();

        const tc: validationUtils.RangeConstraints = {
            lowerLimitIncl: 1,
            upperLimitIncl: 64,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        return undefined;
    }
}