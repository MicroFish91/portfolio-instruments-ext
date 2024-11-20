import { PromptStep } from "../../../wizard/PromptStep";
import { HoldingCreateContext } from "./HoldingCreateContext";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { AssetCategory } from "../../../sdk/types/holdings";

export class HoldingAssetCategoryStep<T extends HoldingCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.holdingAssetCategory = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Specify a holding category'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.holdingAssetCategory;
    }

    private getPicks(context: T): PiQuickPickItem<AssetCategory>[] {
        const current = l10n.t("(current)");

        function isCurrent(assetCategory: AssetCategory): boolean {
            return context.holding?.asset_category === assetCategory;
        }

        return [
            { label: "Cash", description: `CASH${isCurrent(AssetCategory.Cash) ? ` ${current}` : ""}`, data: AssetCategory.Cash },
            { label: "Bills", description: `BILLS${isCurrent(AssetCategory.Bills) ? ` ${current}` : ""}`, data: AssetCategory.Bills },
            { label: "Short-Term Bonds", description: `STB${isCurrent(AssetCategory.Stb) ? ` ${current}` : ""}`, data: AssetCategory.Stb },
            { label: "Intermediate-Term Bonds", description: `ITB${isCurrent(AssetCategory.Itb) ? ` ${current}` : ""}`, data: AssetCategory.Itb },
            { label: "Long-Term Bonds", description: `LTB${isCurrent(AssetCategory.Ltb) ? ` ${current}` : ""}`, data: AssetCategory.Ltb },
            { label: "Total Stock Market", description: `TSM${isCurrent(AssetCategory.Tsm) ? ` ${current}` : ""}`, data: AssetCategory.Tsm },
            { label: "Domestic Large-Cap Blend", description: `DLCB${isCurrent(AssetCategory.Dlcb) ? ` ${current}` : ""}`, data: AssetCategory.Dlcb },
            { label: "Domestic Large-Cap Growth", description: `DLCG${isCurrent(AssetCategory.Dlcg) ? ` ${current}` : ""}`, data: AssetCategory.Dlcg },
            { label: "Domestic Large-Cap Value", description: `DLCV${isCurrent(AssetCategory.Dlcv) ? ` ${current}` : ""}`, data: AssetCategory.Dlcv },
            { label: "Domestic Mid-Cap Blend", description: `DMCB${isCurrent(AssetCategory.Dmcb) ? ` ${current}` : ""}`, data: AssetCategory.Dmcb },
            { label: "Domestic Mid-Cap Growth", description: `DMCG${isCurrent(AssetCategory.Dmcg) ? ` ${current}` : ""}`, data: AssetCategory.Dmcg },
            { label: "Domestic Mid-Cap Value", description: `DMCV${isCurrent(AssetCategory.Dmcv) ? ` ${current}` : ""}`, data: AssetCategory.Dmcv },
            { label: "Domestic Small-Cap Growth", description: `DSCG${isCurrent(AssetCategory.Dscg) ? ` ${current}` : ""}`, data: AssetCategory.Dscg },
            { label: "Domestic Small-Cap Bonds", description: `DSCB${isCurrent(AssetCategory.Dscb) ? ` ${current}` : ""}`, data: AssetCategory.Dscb },
            { label: "Domestic Small-Cap Value", description: `DSCV${isCurrent(AssetCategory.Dscv) ? ` ${current}` : ""}`, data: AssetCategory.Dscv },
            { label: "International Large-Cap Blend", description: `ILCB${isCurrent(AssetCategory.Ilcb) ? ` ${current}` : ""}`, data: AssetCategory.Ilcb },
            { label: "International Large-Cap Growth", description: `ILCG${isCurrent(AssetCategory.Ilcg) ? ` ${current}` : ""}`, data: AssetCategory.Ilcg },
            { label: "International Large-Cap Value", description: `ILCV${isCurrent(AssetCategory.Ilcv) ? ` ${current}` : ""}`, data: AssetCategory.Ilcv },
            { label: "International Mid-Cap Blend", description: `IMCB${isCurrent(AssetCategory.Imcb) ? ` ${current}` : ""}`, data: AssetCategory.Imcb },
            { label: "International Mid-Cap Growth", description: `IMCG${isCurrent(AssetCategory.Imcg) ? ` ${current}` : ""}`, data: AssetCategory.Imcg },
            { label: "International Mid-Cap Value", description: `IMCV${isCurrent(AssetCategory.Imcv) ? ` ${current}` : ""}`, data: AssetCategory.Imcv },
            { label: "International Small-Cap Blend", description: `ISCB${isCurrent(AssetCategory.Iscb) ? ` ${current}` : ""}`, data: AssetCategory.Iscb },
            { label: "International Small-Cap Growth", description: `ISCG${isCurrent(AssetCategory.Iscg) ? ` ${current}` : ""}`, data: AssetCategory.Iscg },
            { label: "International Small-Cap Value", description: `ISCV${isCurrent(AssetCategory.Iscv) ? ` ${current}` : ""}`, data: AssetCategory.Iscv },
            { label: "Commodities", description: `COMMODITIES${isCurrent(AssetCategory.Commodities) ? ` ${current}` : ""}`, data: AssetCategory.Commodities },
            { label: "Gold", description: `GOLD${isCurrent(AssetCategory.Gold) ? ` ${current}` : ""}`, data: AssetCategory.Gold },
            { label: "Real-Estate Investment Trusts", description: `REITS${isCurrent(AssetCategory.Reits) ? ` ${current}` : ""}`, data: AssetCategory.Reits },
            { label: "Crypto Currency", description: `CRYPTO${isCurrent(AssetCategory.Crypto) ? ` ${current}` : ""}`, data: AssetCategory.Crypto },
            { label: "Other", description: `OTHER${isCurrent(AssetCategory.Other) ? ` ${current}` : ""}`, data: AssetCategory.Other },
        ];
    }
}