import { l10n, QuickPickItem } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { PromptStep } from "../../../wizard/PromptStep";
import { TaxShelter } from "../../../sdk/types/accounts";

export class AccountTaxShelterStep<T extends AccountCreateContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.accountTaxShelter = (await context.ui.showQuickPick(this.getPicks(), {
            title: this.title,
            placeHolder: l10n.t('Choose a tax shelter type'),
        }))?.label as TaxShelter;
    }

    shouldPrompt(context: T): boolean {
        return !context.accountTaxShelter && !context.account;
    }

    private getPicks(): QuickPickItem[] {
        return [
            { label: TaxShelter.Taxable },
            { label: TaxShelter.Roth },
            { label: TaxShelter.Traditional },
            { label: TaxShelter.HSA },
            { label: TaxShelter.FiveTwentyNine },
        ];
    }
}