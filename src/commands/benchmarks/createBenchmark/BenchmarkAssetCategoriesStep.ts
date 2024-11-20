import { PromptStep } from "../../../wizard/PromptStep";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { AssetCategory } from "../../../sdk/types/holdings";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";
import { AssetAllocationPct } from "../../../sdk/types/benchmarks";

export class BenchmarkAssetCategoriesStep<T extends BenchmarkCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const assets: PiQuickPickItem<AssetCategory>[] = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Select benchmark asset categories'),
            canPickMany: true,
        }) as PiQuickPickItem<AssetCategory>[] | undefined) ?? [];
        context.benchmarkAssets = assets.map(a => a.data);
    }

    shouldPrompt(context: T): boolean {
        return !context.benchmarkAssets;
    }

    private getPicks(context: T): PiQuickPickItem<AssetCategory>[] {
        const currentAllocations: AssetAllocationPct[] = context.benchmark?.asset_allocation ?? [];
        const categories: Set<AssetCategory> = new Set();
        for (const b of currentAllocations) {
            categories.add(b.category);
        }

        return [
            { label: "Cash", description: "CASH", picked: categories.has(AssetCategory.Cash), data: AssetCategory.Cash },
            { label: "Bills", description: "BILLS", picked: categories.has(AssetCategory.Bills), data: AssetCategory.Bills },
            { label: "Short-Term Bonds", description: "STB", picked: categories.has(AssetCategory.Stb), data: AssetCategory.Stb },
            { label: "Intermediate-Term Bonds", description: "ITB", picked: categories.has(AssetCategory.Itb), data: AssetCategory.Itb },
            { label: "Long-Term Bonds", description: "LTB", picked: categories.has(AssetCategory.Ltb), data: AssetCategory.Ltb },
            { label: "Total Stock Market", description: "TSM", picked: categories.has(AssetCategory.Tsm), data: AssetCategory.Tsm },
            { label: "Domestic Large-Cap Blend", description: "DLCB", picked: categories.has(AssetCategory.Dlcb), data: AssetCategory.Dlcb },
            { label: "Domestic Large-Cap Growth", description: "DLCG", picked: categories.has(AssetCategory.Dlcg), data: AssetCategory.Dlcg },
            { label: "Domestic Large-Cap Value", description: "DLCV", picked: categories.has(AssetCategory.Dlcv), data: AssetCategory.Dlcv },
            { label: "Domestic Mid-Cap Blend", description: "DMCB", picked: categories.has(AssetCategory.Dmcb), data: AssetCategory.Dmcb },
            { label: "Domestic Mid-Cap Growth", description: "DMCG", picked: categories.has(AssetCategory.Dmcg), data: AssetCategory.Dmcg },
            { label: "Domestic Mid-Cap Value", description: "DMCV", picked: categories.has(AssetCategory.Dmcv), data: AssetCategory.Dmcv },
            { label: "Domestic Small-Cap Growth", description: "DSCG", picked: categories.has(AssetCategory.Dscg), data: AssetCategory.Dscg },
            { label: "Domestic Small-Cap Bonds", description: "DSCB", picked: categories.has(AssetCategory.Dscb), data: AssetCategory.Dscb },
            { label: "Domestic Small-Cap Value", description: "DSCV", picked: categories.has(AssetCategory.Dscv), data: AssetCategory.Dscv },
            { label: "International Large-Cap Blend", description: "ILCB", picked: categories.has(AssetCategory.Ilcb), data: AssetCategory.Ilcb },
            { label: "International Large-Cap Growth", description: "ILCG", picked: categories.has(AssetCategory.Ilcg), data: AssetCategory.Ilcg },
            { label: "International Large-Cap Value", description: "ILCV", picked: categories.has(AssetCategory.Ilcv), data: AssetCategory.Ilcv },
            { label: "International Mid-Cap Blend", description: "IMCB", picked: categories.has(AssetCategory.Imcb), data: AssetCategory.Imcb },
            { label: "International Mid-Cap Growth", description: "IMCG", picked: categories.has(AssetCategory.Imcg), data: AssetCategory.Imcg },
            { label: "International Mid-Cap Value", description: "IMCV", picked: categories.has(AssetCategory.Imcv), data: AssetCategory.Imcv },
            { label: "International Small-Cap Blend", description: "ISCB", picked: categories.has(AssetCategory.Iscb), data: AssetCategory.Iscb },
            { label: "International Small-Cap Growth", description: "ISCG", picked: categories.has(AssetCategory.Iscg), data: AssetCategory.Iscg },
            { label: "International Small-Cap Value", description: "ISCV", picked: categories.has(AssetCategory.Iscv), data: AssetCategory.Iscv },
            { label: "Commodities", description: "COMMODITIES", picked: categories.has(AssetCategory.Commodities), data: AssetCategory.Commodities },
            { label: "Gold", description: "GOLD", picked: categories.has(AssetCategory.Gold), data: AssetCategory.Gold },
            { label: "Real-Estate Investment Trusts", description: "REITS", picked: categories.has(AssetCategory.Reits), data: AssetCategory.Reits },
            { label: "Crypto Currency", description: "CRYPTO", picked: categories.has(AssetCategory.Crypto), data: AssetCategory.Crypto },
            { label: "Other", description: "OTHER", picked: categories.has(AssetCategory.Other), data: AssetCategory.Other },
        ];
    }
}