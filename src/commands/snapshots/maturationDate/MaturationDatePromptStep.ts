import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { CommandContext } from "../../registerCommand";

export type MaturationDatePromptStepOptions = {
    prompt: string;
    default?: string;
};

export class MaturationDatePromptStep<T extends CommandContext & { maturationDate?: string }> extends PromptStep<T> {
    constructor(readonly options: MaturationDatePromptStepOptions) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.maturationDate = (await context.ui.showInputBox({
            title: this.title,
            prompt: this.options.prompt,
            value: this.options.default,
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.maturationDate;
    }

    private validateInput(value: string): string | undefined {
        if (!value) {
            return undefined;
        }

        value = value.trim();

        const tc: validationUtils.RangeConstraints = {
            lowerLimitIncl: 10,
            upperLimitIncl: 10,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        const pattern: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!pattern.test(value)) {
            return l10n.t('Value must have the following format: mm/dd/yyyy');
        }

        const [month, day, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // If the date is not a valid calendar date (like February 30 or April 31), the Date object will adjust the day to a valid date
        // We can check for adjustments as a way to ensure the dates submitted are real dates
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return l10n.t('Value must be a real date (mm/dd/yyyy)');
        }

        return undefined;
    }
}