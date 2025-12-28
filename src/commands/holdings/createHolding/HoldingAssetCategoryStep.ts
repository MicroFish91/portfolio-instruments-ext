import { PromptStep } from "../../../wizard/PromptStep";
import { HoldingCreateContext } from "./HoldingCreateContext";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { AssetCategory } from "../../../sdk/portfolio-instruments-api";

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
            { label: "Short-Term Bonds", description: `STB${isCurrent(AssetCategory.STB) ? ` ${current}` : ""}`, data: AssetCategory.STB },
            { label: "Intermediate-Term Bonds", description: `ITB${isCurrent(AssetCategory.ITB) ? ` ${current}` : ""}`, data: AssetCategory.ITB },
            { label: "Long-Term Bonds", description: `LTB${isCurrent(AssetCategory.LTB) ? ` ${current}` : ""}`, data: AssetCategory.LTB },
            { label: "Total Stock Market", description: `TSM${isCurrent(AssetCategory.TSM) ? ` ${current}` : ""}`, data: AssetCategory.TSM },
            { label: "Domestic Large-Cap Blend", description: `DLCB${isCurrent(AssetCategory.DLCB) ? ` ${current}` : ""}`, data: AssetCategory.DLCB },
            { label: "Domestic Large-Cap Growth", description: `DLCG${isCurrent(AssetCategory.DLCG) ? ` ${current}` : ""}`, data: AssetCategory.DLCG },
            { label: "Domestic Large-Cap Value", description: `DLCV${isCurrent(AssetCategory.DLCV) ? ` ${current}` : ""}`, data: AssetCategory.DLCV },
            { label: "Domestic Large-Cap Momentum", description: `DLCM${isCurrent(AssetCategory.DLCM) ? ` ${current}` : ""}`, data: AssetCategory.DLCM },
            { label: "Domestic Mid-Cap Blend", description: `DMCB${isCurrent(AssetCategory.DMCB) ? ` ${current}` : ""}`, data: AssetCategory.DMCB },
            { label: "Domestic Mid-Cap Growth", description: `DMCG${isCurrent(AssetCategory.DMCG) ? ` ${current}` : ""}`, data: AssetCategory.DMCG },
            { label: "Domestic Mid-Cap Value", description: `DMCV${isCurrent(AssetCategory.DMCV) ? ` ${current}` : ""}`, data: AssetCategory.DMCV },
            { label: "Domestic Mid-Cap Momentum", description: `DMCM${isCurrent(AssetCategory.DMCM) ? ` ${current}` : ""}`, data: AssetCategory.DMCM },
            { label: "Domestic Small-Cap Growth", description: `DSCG${isCurrent(AssetCategory.DSCG) ? ` ${current}` : ""}`, data: AssetCategory.DSCG },
            { label: "Domestic Small-Cap Bonds", description: `DSCB${isCurrent(AssetCategory.DSCB) ? ` ${current}` : ""}`, data: AssetCategory.DSCB },
            { label: "Domestic Small-Cap Value", description: `DSCV${isCurrent(AssetCategory.DSCV) ? ` ${current}` : ""}`, data: AssetCategory.DSCV },
            { label: "Domestic Small-Cap Momentum", description: `DSCM${isCurrent(AssetCategory.DSCM) ? ` ${current}` : ""}`, data: AssetCategory.DSCM },
            { label: "International Large-Cap Blend", description: `ILCB${isCurrent(AssetCategory.ILCB) ? ` ${current}` : ""}`, data: AssetCategory.ILCB },
            { label: "International Large-Cap Growth", description: `ILCG${isCurrent(AssetCategory.ILCG) ? ` ${current}` : ""}`, data: AssetCategory.ILCG },
            { label: "International Large-Cap Value", description: `ILCV${isCurrent(AssetCategory.ILCV) ? ` ${current}` : ""}`, data: AssetCategory.ILCV },
            { label: "International Large-Cap Momentum", description: `ILCM${isCurrent(AssetCategory.ILCM) ? ` ${current}` : ""}`, data: AssetCategory.ILCM },
            { label: "International Mid-Cap Blend", description: `IMCB${isCurrent(AssetCategory.IMCB) ? ` ${current}` : ""}`, data: AssetCategory.IMCB },
            { label: "International Mid-Cap Growth", description: `IMCG${isCurrent(AssetCategory.IMCG) ? ` ${current}` : ""}`, data: AssetCategory.IMCG },
            { label: "International Mid-Cap Value", description: `IMCV${isCurrent(AssetCategory.IMCV) ? ` ${current}` : ""}`, data: AssetCategory.IMCV },
            { label: "International Mid-Cap Momentum", description: `IMCM${isCurrent(AssetCategory.IMCM) ? ` ${current}` : ""}`, data: AssetCategory.IMCM },
            { label: "International Small-Cap Blend", description: `ISCB${isCurrent(AssetCategory.ISCB) ? ` ${current}` : ""}`, data: AssetCategory.ISCB },
            { label: "International Small-Cap Growth", description: `ISCG${isCurrent(AssetCategory.ISCG) ? ` ${current}` : ""}`, data: AssetCategory.ISCG },
            { label: "International Small-Cap Value", description: `ISCV${isCurrent(AssetCategory.ISCV) ? ` ${current}` : ""}`, data: AssetCategory.ISCV },
            { label: "International Small-Cap Momentum", description: `ISCM${isCurrent(AssetCategory.ISCM) ? ` ${current}` : ""}`, data: AssetCategory.ISCM },
            { label: "Commodities", description: `COMMODITIES${isCurrent(AssetCategory.Commodities) ? ` ${current}` : ""}`, data: AssetCategory.Commodities },
            { label: "Gold", description: `GOLD${isCurrent(AssetCategory.Gold) ? ` ${current}` : ""}`, data: AssetCategory.Gold },
            { label: "Real-Estate Investment Trusts", description: `REITS${isCurrent(AssetCategory.REITS) ? ` ${current}` : ""}`, data: AssetCategory.REITS },
            { label: "Crypto Currency", description: `CRYPTO${isCurrent(AssetCategory.Crypto) ? ` ${current}` : ""}`, data: AssetCategory.Crypto },
            { label: "Other", description: `OTHER${isCurrent(AssetCategory.Other) ? ` ${current}` : ""}`, data: AssetCategory.Other },
        ];
    }
}