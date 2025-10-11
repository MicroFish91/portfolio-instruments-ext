import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { SnapshotsPlotContext } from "./SnapshotsPlotContext";

export class SnapshotStartDatePromptStep<T extends SnapshotsPlotContext> extends PromptStep<T> {
    constructor(readonly startDate?: string) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.startDate = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter a start date (mm/dd/yyyy).'),
            value: this.startDate,
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.startDate;
    }

    private validateInput(value: string = ''): string | undefined {
        value = value.trim();

        if (!value) {
            return l10n.t('A start date (mm/dd/yyyy) is required.');
        }

        const tc: validationUtils.RangeConstraints = {
            lowerLimitIncl: 10,
            upperLimitIncl: 10,
        };

        if (!validationUtils.hasValidCharLength(value, tc)) {
            return validationUtils.getInvalidCharLengthMessage(tc);
        }

        const pattern: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!pattern.test(value)) {
            return l10n.t('Start date must have the following format: mm/dd/yyyy');
        }

        const [month, day, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // If the date is not a valid calendar date (like February 30 or April 31), the Date object will adjust the day to a valid date
        // We can check for adjustments as a way to ensure the dates submitted are real dates
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return l10n.t('Start date must be a real date (mm/dd/yyyy)');
        }

        // We do it this way to allow entering the same day
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (date.getTime() > today.getTime()) {
            return l10n.t('Start date cannot be in the future.');
        }

        return undefined;
    }
}