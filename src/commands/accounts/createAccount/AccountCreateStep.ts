import { Progress } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { createAccount, CreateAccountApiResponse } from "../../../sdk/accounts/createAccount";
import { nonNullProp } from "../../../utils/nonNull";

export class AccountCreateStep<T extends AccountCreateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating account..." });

        const response: CreateAccountApiResponse = await createAccount(context.token, {
            name: nonNullProp(context, 'accountName'),
            description: context.accountDescription,
            institution: nonNullProp(context, 'accountInstitution'),
            tax_shelter: nonNullProp(context, 'accountTaxShelter'),
            is_deprecated: false,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.account = response.data?.account;
    }

    shouldExecute(context: T): boolean {
        return !context.account;
    }
}
