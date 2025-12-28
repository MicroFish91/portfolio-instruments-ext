import { PromptStep } from "../../../wizard/PromptStep";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";
import { AssetAllocationPct, AssetCategory } from "../../../sdk/portfolio-instruments-api";

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
            { label: "Short-Term Bonds", description: "STB", picked: categories.has(AssetCategory.STB), data: AssetCategory.STB },
            { label: "Intermediate-Term Bonds", description: "ITB", picked: categories.has(AssetCategory.ITB), data: AssetCategory.ITB },
            { label: "Long-Term Bonds", description: "LTB", picked: categories.has(AssetCategory.LTB), data: AssetCategory.LTB },
            { label: "Total Stock Market", description: "TSM", picked: categories.has(AssetCategory.TSM), data: AssetCategory.TSM },
            { label: "Domestic Large-Cap Blend", description: "DLCB", picked: categories.has(AssetCategory.DLCB), data: AssetCategory.DLCB },
            { label: "Domestic Large-Cap Growth", description: "DLCG", picked: categories.has(AssetCategory.DLCG), data: AssetCategory.DLCG },
            { label: "Domestic Large-Cap Value", description: "DLCV", picked: categories.has(AssetCategory.DLCV), data: AssetCategory.DLCV },
            { label: "Domestic Large-Cap Momentum", description: "DLCM", picked: categories.has(AssetCategory.DLCM), data: AssetCategory.DLCM },
            { label: "Domestic Mid-Cap Blend", description: "DMCB", picked: categories.has(AssetCategory.DMCB), data: AssetCategory.DMCB },
            { label: "Domestic Mid-Cap Growth", description: "DMCG", picked: categories.has(AssetCategory.DMCG), data: AssetCategory.DMCG },
            { label: "Domestic Mid-Cap Value", description: "DMCV", picked: categories.has(AssetCategory.DMCV), data: AssetCategory.DMCV },
            { label: "Domestic Mid-Cap Momentum", description: "DMCM", picked: categories.has(AssetCategory.DMCM), data: AssetCategory.DMCM },
            { label: "Domestic Small-Cap Growth", description: "DSCG", picked: categories.has(AssetCategory.DSCG), data: AssetCategory.DSCG },
            { label: "Domestic Small-Cap Bonds", description: "DSCB", picked: categories.has(AssetCategory.DSCB), data: AssetCategory.DSCB },
            { label: "Domestic Small-Cap Value", description: "DSCV", picked: categories.has(AssetCategory.DSCV), data: AssetCategory.DSCV },
            { label: "Domestic Small-Cap Momentum", description: "DSCM", picked: categories.has(AssetCategory.DSCM), data: AssetCategory.DSCM },
            { label: "International Large-Cap Blend", description: "ILCB", picked: categories.has(AssetCategory.ILCB), data: AssetCategory.ILCB },
            { label: "International Large-Cap Growth", description: "ILCG", picked: categories.has(AssetCategory.ILCG), data: AssetCategory.ILCG },
            { label: "International Large-Cap Value", description: "ILCV", picked: categories.has(AssetCategory.ILCV), data: AssetCategory.ILCV },
            { label: "International Large-Cap Momentum", description: "ILCM", picked: categories.has(AssetCategory.ILCM), data: AssetCategory.ILCM },
            { label: "International Mid-Cap Blend", description: "IMCB", picked: categories.has(AssetCategory.IMCB), data: AssetCategory.IMCB },
            { label: "International Mid-Cap Growth", description: "IMCG", picked: categories.has(AssetCategory.IMCG), data: AssetCategory.IMCG },
            { label: "International Mid-Cap Value", description: "IMCV", picked: categories.has(AssetCategory.IMCV), data: AssetCategory.IMCV },
            { label: "International Mid-Cap Momentum", description: "IMCM", picked: categories.has(AssetCategory.IMCM), data: AssetCategory.IMCM },
            { label: "International Small-Cap Blend", description: "ISCB", picked: categories.has(AssetCategory.ISCB), data: AssetCategory.ISCB },
            { label: "International Small-Cap Growth", description: "ISCG", picked: categories.has(AssetCategory.ISCG), data: AssetCategory.ISCG },
            { label: "International Small-Cap Value", description: "ISCV", picked: categories.has(AssetCategory.ISCV), data: AssetCategory.ISCV },
            { label: "International Small-Cap Momentum", description: "ISCM", picked: categories.has(AssetCategory.ISCM), data: AssetCategory.ISCM },
            { label: "Commodities", description: "COMMODITIES", picked: categories.has(AssetCategory.Commodities), data: AssetCategory.Commodities },
            { label: "Gold", description: "GOLD", picked: categories.has(AssetCategory.Gold), data: AssetCategory.Gold },
            { label: "Real-Estate Investment Trusts", description: "REITS", picked: categories.has(AssetCategory.REITS), data: AssetCategory.REITS },
            { label: "Crypto Currency", description: "CRYPTO", picked: categories.has(AssetCategory.Crypto), data: AssetCategory.Crypto },
            { label: "Other", description: "OTHER", picked: categories.has(AssetCategory.Other), data: AssetCategory.Other },
        ];
    }
}