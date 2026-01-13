import { l10n } from "vscode";
import { SnapshotCreateContext } from "../../../snapshots/SnapshotCreateContext";
import { PromptStep, WizardSteps } from "../../../../wizard/PromptStep";
import { validationUtils } from "../../../../utils/validationUtils";
import { getMostRecentSnapshotByDate } from "../../../../sdk/snapshots/getSnapshots";
import { BenchmarkListStep } from "../../../benchmarks/BenchmarkListStep";
import { SnapshotRebalanceThresholdStep } from "../SnapshotRebalanceThresholdStep";

export type SnapshotDateStepOptions = {
    defaultDate?: string;
};

export class SnapshotDateStep<T extends SnapshotCreateContext> extends PromptStep<T> {
    constructor(readonly options?: SnapshotDateStepOptions) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.snapDate = (await context.ui.showInputBox({
            title: this.title,
            value: this.options?.defaultDate ?? this.getTodaysDateFormatted(),
            prompt: l10n.t('Enter the snapshot date (mm/dd/yyyy)'),
            validateInput: this.validateInput,
        }))?.trim();
    }

    shouldPrompt(context: T): boolean {
        return !context.snapDate;
    }

    private validateInput(value: string): string | undefined {
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

    private getTodaysDateFormatted(): string {
        const now = new Date();

        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const yyyy = now.getFullYear();

        return `${mm}/${dd}/${yyyy}`;
    }

    async subWizard(context: T): Promise<WizardSteps<T>> {
        if (context.snapDate) {
            const response = await getMostRecentSnapshotByDate(context.token, context.snapDate);
            context.mostRecentSnapshot = response.data?.snapshots[0];
        }

        return {
            promptSteps: [
                new BenchmarkListStep({ currentId: context.mostRecentSnapshot?.benchmark_id }),
                new SnapshotRebalanceThresholdStep({ defaultThresholdPct: context.mostRecentSnapshot?.rebalance_threshold_pct }),
            ],
        };
    }
}