import { l10n } from "vscode";
import { AccountsItem } from "../../../tree/accounts/AccountsItem";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { AccountCreateContext } from "./AccountCreateContext";
import { AccountDescriptionStep } from "./AccountDescriptionStep";
import { AccountInstitutionStep } from "./AccountInstitutionStep";
import { AccountTaxShelterStep } from "./AccountTaxShelterStep";
import { AccountNameStep } from "./AccountNameStep";
import { AccountCreateStep } from "./AccountCreateStep";
import { ext } from "../../../extensionVariables";

export async function createAccount(context: CommandContext, item: AccountsItem): Promise<void> {
    const wizardContext: AccountCreateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<AccountCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a financial account'),
        promptSteps: [
            new AccountNameStep(),
            new AccountDescriptionStep(),
            new AccountInstitutionStep(),
            new AccountTaxShelterStep(),
        ],
        executeSteps: [
            new AccountCreateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created account "{0}"', nonNullValueAndProp(wizardContext.account, 'name')));
    ext.resourceCache.delete(AccountsItem.generatePiExtAccountsId(wizardContext.email));
    ext.portfolioInstrumentsTdp.refresh(item);
}