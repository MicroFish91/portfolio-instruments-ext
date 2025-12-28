import { PromptStep } from "../../../wizard/PromptStep";
import { l10n } from "vscode";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";
import { nonNullProp, nonNullValue } from "../../../utils/nonNull";
import { AssetCategory } from "../../../sdk/portfolio-instruments-api";

export class BenchmarkAssetAmountsStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    private invalidInputMessage: string;
    private numberOfAssets: number;

    async prompt(context: T): Promise<void> {
        const benchmarkAssets: AssetCategory[] = nonNullProp(context, 'benchmarkAssets');
        this.invalidInputMessage = benchmarkAssets.join(',');
        this.numberOfAssets = benchmarkAssets.length;

        const assetAmounts: string | undefined = (await context.ui.showInputBox({
            title: this.title,
            prompt: l10n.t('Enter benchmark asset amounts as comma-separated integers (%)'),
            value: context.benchmark?.asset_allocation.map(a => a.percent).join(','),
            placeHolder: l10n.t('e.g. 25,25,25,25'),
            validateInput: this.validateInput.bind(this),
        }))?.trim();

        context.benchmarkAssetAmounts = nonNullValue(assetAmounts)
            .split(',')
            .map(v => Number(v));
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkAssetAmounts;
    }

    private validateInput(value: string): string | undefined {
        value = value.trim();

        const pattern: RegExp = /^\d{1,3}(\,\d{1,2})*?$/;
        if (!pattern.test(value)) {
            return this.invalidInputMessage;
        }

        const values: string[] = value.split(',');
        if (values.length !== this.numberOfAssets) {
            return this.invalidInputMessage;
        }

        const sum: number = values
            .map(v => Number(v))
            .reduce((a, b) => a + b, 0);

        if (sum !== 100) {
            return this.invalidInputMessage;
        }

        return undefined;
    }
}