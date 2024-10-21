import { PromptStep } from "../../../wizard/PromptStep";
import { HoldingCreateContext } from "./HoldingCreateContext";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { AssetCategory } from "../../../sdk/types/holdings";

export class HoldingAssetCategoryStep<T extends HoldingCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.holdingAssetCategory = (await context.ui.showQuickPick(this.getPicks(), {
            title: this.title,
            placeHolder: l10n.t('Specify a holding category'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.holdingAssetCategory && !context.holding;
    }

    private getPicks(): PiQuickPickItem<AssetCategory>[] {
        return [
            { label: "Cash", description: "CASH", data: AssetCategory.Cash },
            { label: "Bills", description: "BILLS", data: AssetCategory.Bills },
            { label: "Short-Term Bonds", description: "STB", data: AssetCategory.Stb },
            { label: "Intermediate-Term Bonds", description: "ITB", data: AssetCategory.Itb },
            { label: "Long-Term Bonds", description: "LTB", data: AssetCategory.Ltb },
            { label: "Total Stock Market", description: "TSM", data: AssetCategory.Tsm },
            { label: "Domestic Large-Cap Blend", description: "DLCB", data: AssetCategory.Dlcb },
            { label: "Domestic Large-Cap Growth", description: "DLCG", data: AssetCategory.Dlcg },
            { label: "Domestic Large-Cap Value", description: "DLCV", data: AssetCategory.Dlcv },
            { label: "Domestic Mid-Cap Blend", description: "DMCB", data: AssetCategory.Dmcb },
            { label: "Domestic Mid-Cap Growth", description: "DMCG", data: AssetCategory.Dmcg },
            { label: "Domestic Mid-Cap Value", description: "DMCV", data: AssetCategory.Dmcv },
            { label: "Domestic Small-Cap Growth", description: "DSCG", data: AssetCategory.Dscg },
            { label: "Domestic Small-Cap Bonds", description: "DSCB", data: AssetCategory.Dscb },
            { label: "Domestic Small-Cap Value", description: "DSCV", data: AssetCategory.Dscv },
            { label: "International Large-Cap Blend", description: "ILCB", data: AssetCategory.Ilcb },
            { label: "International Large-Cap Growth", description: "ILCG", data: AssetCategory.Ilcg },
            { label: "International Large-Cap Value", description: "ILCV", data: AssetCategory.Ilcv },
            { label: "International Mid-Cap Blend", description: "IMCB", data: AssetCategory.Imcb },
            { label: "International Mid-Cap Growth", description: "IMCG", data: AssetCategory.Imcg },
            { label: "International Mid-Cap Value", description: "IMCV", data: AssetCategory.Imcv },
            { label: "International Small-Cap Blend", description: "ISCB", data: AssetCategory.Iscb },
            { label: "International Small-Cap Growth", description: "ISCG", data: AssetCategory.Iscg },
            { label: "International Small-Cap Value", description: "ISCV", data: AssetCategory.Iscv },
            { label: "Commodities", description: "COMMODITIES", data: AssetCategory.Commodities },
            { label: "Gold", description: "GOLD", data: AssetCategory.Gold },
            { label: "Real-Estate Investment Trusts", description: "REITS", data: AssetCategory.Reits },
            { label: "Other", description: "OTHER", data: AssetCategory.Other },
        ];
    }
}