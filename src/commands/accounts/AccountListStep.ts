import { l10n } from "vscode";
import { AuthContext } from "../AuthContext";
import { PromptStep } from "../../wizard/PromptStep";
import { PiQuickPickItem } from "../../wizard/UserInterface";
import { nonNullValueAndProp } from "../../utils/nonNull";
import { getAccounts, GetAccountsApiResponse } from "../../sdk/accounts/getAccounts";
import { Account } from "../../sdk/types/accounts";

export type AccountListStepOptions = {
    currentId?: number;
};

export class AccountListStep<T extends AuthContext & { accountId?: number }> extends PromptStep<T> {
    constructor(readonly options?: AccountListStepOptions) {
        super();
    }

    async prompt(context: T): Promise<void> {
        context.accountId = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Select a target account'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.accountId;
    }

    private async getPicks(context: T): Promise<PiQuickPickItem<number | undefined>[]> {
        const response: GetAccountsApiResponse = await getAccounts(context.token);
        if (response.error) {
            throw new Error(l10n.t('No accounts available - please create an account first.'));
        }

        const accounts: Account[] = nonNullValueAndProp(response.data, 'accounts');
        return accounts.map(account => {
            return {
                label: account.name,
                description: this.getDescription(account.account_id, `${account.institution}-${account.tax_shelter}`),
                detail: account.description,
                data: account.account_id,
            };
        });
    }

    private getDescription(accountId: number, descriptionBase: string): string {
        return accountId === this.options?.currentId ? `${descriptionBase} (current)` : descriptionBase;
    }
}