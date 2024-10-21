import { PromptStep, WizardSteps } from "../../../wizard/PromptStep";
import { HoldingCreateContext } from "./HoldingCreateContext";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { l10n } from "vscode";
import { HoldingTickerStep } from "./HoldingTickerStep";
import { HoldingMaturationDateStep } from "./HoldingMaturationDateStep";
import { HoldingExpenseRatioStep } from "./HoldingExpenseRatioStep";
import { HoldingInterestRateStep } from "./HoldingInterestRateStep";

export enum HoldingType {
    ListedSecurity = 'ListedSecurity',
    UnlistedFixedIncome = 'UnlistedFixedIncome',
    Other = 'Other',
}

export class HoldingTypeListStep<T extends HoldingCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        const current: string = l10n.t('(current)');

        const items: PiQuickPickItem<HoldingType>[] = [
            {
                label: l10n.t('Listed Securities'),
                description: context.holding?.ticker ? current : undefined,
                detail: l10n.t('Assets with tickers that are publicly traded on exchanges'),
                data: HoldingType.ListedSecurity,
            },
            {
                label: l10n.t('Unlisted Fixed Income'),
                description: context.holding?.interest_rate_pct || context.holding?.maturation_date ? current : undefined,
                detail: l10n.t('Fixed income assets like secondary market bonds and bills without tickers'),
                data: HoldingType.UnlistedFixedIncome,
            },
            {
                label: l10n.t('Other Investments'),
                description: !context.holding?.ticker && !context.holding?.interest_rate_pct && !context.holding?.maturation_date && context.holding ? current : undefined,
                detail: l10n.t('Assets that do not fall into the listed or unlisted categories'),
                data: HoldingType.Other,
            }
        ];

        context.holdingType = (await context.ui.showQuickPick(items, {
            title: this.title,
            placeHolder: l10n.t('Choose a holding type'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.holdingType;
    }

    subWizard(context: T): WizardSteps<T> {
        switch (context.holdingType) {
            case HoldingType.ListedSecurity:
                return {
                    promptSteps: [
                        new HoldingTickerStep(),
                        new HoldingExpenseRatioStep(),
                    ],
                };
            case HoldingType.UnlistedFixedIncome:
                return {
                    promptSteps: [
                        new HoldingInterestRateStep(),
                        new HoldingMaturationDateStep(),
                    ],
                };
            case HoldingType.Other:
            default:
                return undefined;
        }
    }
}