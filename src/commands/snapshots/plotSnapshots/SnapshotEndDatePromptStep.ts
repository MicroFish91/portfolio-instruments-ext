import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { SnapshotsPlotContext } from "./SnapshotsPlotContext";

export class SnapshotEndDatePromptStep<T extends SnapshotsPlotContext> extends PromptStep<T> {
    constructor(readonly options: { endDate?: string } = {}) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.endDate = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter an end date (mm/dd/yyyy).'),
            value: this.options.endDate,
            validateInput: (value) => this.validateInput(context, value),
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.endDate;
    }

    private validateInput(context: T, value: string = ''): string | undefined {
        value = value.trim();

        if (!value) {
            return l10n.t('An end date (mm/dd/yyyy) is required.');
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
            return l10n.t('End date must have the following format: mm/dd/yyyy');
        }

        const [month, day, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // If the date is not a valid calendar date (like February 30 or April 31), the Date object will adjust the day to a valid date
        // We can check for adjustments as a way to ensure the dates submitted are real dates
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return l10n.t('End date must be a real date (mm/dd/yyyy)');
        }

        // We do it this way to allow entering the same day
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (date.getTime() > today.getTime()) {
            return l10n.t('End date cannot be in the future.');
        }

        if (context.startDate) {
            const [month, day, year] = context.startDate.split('/').map(Number);
            const startDate = new Date(year, month - 1, day);
            if (date.getTime() < startDate.getTime()) {
                return l10n.t('End date cannot be before the start date.');
            }
        }

        return undefined;
    }
}