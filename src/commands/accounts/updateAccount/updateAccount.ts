import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { AccountItem } from "../../../tree/accounts/AccountItem";
import { AccountUpdateContext } from "./AccountUpdateContext";
import { AccountNameStep } from "../createAccount/AccountNameStep";
import { AccountDescriptionStep } from "../createAccount/AccountDescriptionStep";
import { AccountInstitutionStep } from "../createAccount/AccountInstitutionStep";
import { AccountTaxShelterStep } from "../createAccount/AccountTaxShelterStep";
import { AccountUpdateStep } from "./AccountUpdateStep";

export async function updateAccount(context: CommandContext, item: AccountItem): Promise<void> {
    const wizardContext: AccountUpdateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
        account: item.account,
    };

    const wizard: Wizard<AccountUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update financial account'),
        promptSteps: [
            new AccountNameStep(),
            new AccountDescriptionStep(),
            new AccountInstitutionStep(),
            new AccountTaxShelterStep(),
        ],
        executeSteps: [
            new AccountUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Updated account "{0}"', nonNullValueAndProp(wizardContext.updatedAccount, 'name')));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}