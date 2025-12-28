import { l10n } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { PromptStep } from "../../../wizard/PromptStep";
import { PiQuickPickItem } from "../../../wizard/UserInterface";
import { TaxShelter } from "../../../sdk/portfolio-instruments-api";

export class AccountTaxShelterStep<T extends AccountCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.accountTaxShelter = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Choose a tax shelter type'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.accountTaxShelter;
    }

    private getPicks(context: T): PiQuickPickItem<TaxShelter>[] {
        const current: string = '(current)';

        function isCurrent(taxShelter: TaxShelter): boolean {
            return context.account?.tax_shelter === taxShelter;
        }

        return [
            { label: TaxShelter.Taxable, description: isCurrent(TaxShelter.Taxable) ? current : undefined, data: TaxShelter.Taxable },
            { label: TaxShelter.Roth, description: isCurrent(TaxShelter.Roth) ? current : undefined, data: TaxShelter.Roth },
            { label: TaxShelter.Traditional, description: isCurrent(TaxShelter.Traditional) ? current : undefined, data: TaxShelter.Traditional },
            { label: TaxShelter.HSA, description: isCurrent(TaxShelter.HSA) ? current : undefined, data: TaxShelter.HSA },
            { label: TaxShelter.FiveTwentyNine, description: isCurrent(TaxShelter.FiveTwentyNine) ? current : undefined, data: TaxShelter.FiveTwentyNine },
        ];
    }
}