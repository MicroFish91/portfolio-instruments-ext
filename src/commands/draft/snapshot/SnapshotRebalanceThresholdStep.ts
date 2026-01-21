import { l10n } from "vscode";
import { PromptStep } from "../../../wizard/PromptStep";
import { validationUtils } from "../../../utils/validationUtils";
import { SnapshotCreateContext } from "../../snapshots/SnapshotCreateContext";
import { getBenchmark } from "../../../sdk/benchmarks/getBenchmark";

export class SnapshotRebalanceThresholdStep<T extends SnapshotCreateContext> extends PromptStep<T> {
    constructor(private readonly options: { defaultThresholdPct?: number } = {}) {
        super();
    }

    async prompt(context: T): Promise<void> {
        let defaulThresholdPct: number | undefined = this.options.defaultThresholdPct;
        if (!defaulThresholdPct && context.benchmarkId) {
            const response = await getBenchmark(context.token, context.benchmarkId);
            defaulThresholdPct = response.data?.benchmark?.rec_rebalance_threshold_pct;
        }

        context.rebalanceThresholdPct = Number((await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter the snapshot\'s rebalance threshold (%)'),
            value: defaulThresholdPct?.toString(),
            validateInput: this.validateInput,
        })));
    }

    shouldPrompt(context: T): boolean {
        return !context.rebalanceThresholdPct;
    }

    private validateInput(value: string): string | undefined {
        if (!validationUtils.hasValidCharLength(value)) {
            return validationUtils.getInvalidCharLengthMessage();
        }

        const num: number = Number(value);
        if (isNaN(num) || !Number.isInteger(num)) {
            return l10n.t('Value must be a whole number.');
        }

        if (num < 1 || num > 99) {
            return l10n.t('Value must be between 1 and 99.');
        }

        return undefined;
    }
}