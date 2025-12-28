import { Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { AccountUpdateContext } from "./AccountUpdateContext";
import { updateAccount } from "../../../sdk/accounts/updateAccount";
import { UpdateAccountResponse } from "../../../sdk/portfolio-instruments-api";

export class AccountUpdateStep<T extends AccountUpdateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: 'Updating account...' });

        const response: UpdateAccountResponse = await updateAccount(context.token, context.account.account_id, {
            name: nonNullProp(context, 'accountName'),
            description: context.accountDescription,
            institution: nonNullProp(context, 'accountInstitution'),
            tax_shelter: nonNullProp(context, 'accountTaxShelter'),
            is_deprecated: false,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.updatedAccount = response.data?.account;
    }

    shouldExecute(context: T): boolean {
        return !context.updatedAccount;
    }
}
