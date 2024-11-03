import { l10n } from "vscode";
import { AccountItem } from "../../../tree/accounts/AccountItem";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { AccountDeleteContext } from "./AccountDeleteContext";
import { AccountDeleteConfirmStep } from "./AccountDeleteConfirmStep";
import { AccountDeleteStep } from "./AccountDeleteStep";
import { ext } from "../../../extensionVariables";
import { AccountsItem } from "../../../tree/accounts/AccountsItem";

export async function deleteAccount(context: CommandContext, item: AccountItem): Promise<void> {
    const wizardContext: AccountDeleteContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        account: item.account,
    };

    const wizard: Wizard<AccountDeleteContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a financial account'),
        promptSteps: [
            new AccountDeleteConfirmStep(),
        ],
        executeSteps: [
            new AccountDeleteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted account "{0}"', nonNullValueAndProp(wizardContext.account, 'name')));
    ext.resourceCache.delete(AccountsItem.generatePiExtAccountsId(wizardContext.email));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}