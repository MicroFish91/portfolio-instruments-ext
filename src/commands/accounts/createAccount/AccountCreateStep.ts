import { Progress } from "vscode";
import { AccountCreateContext } from "./AccountCreateContext";
import { createAccount } from "../../../sdk/accounts/createAccount";
import { nonNullProp } from "../../../utils/nonNull";
import { CreateAccountResponse } from "../../../sdk/portfolio-instruments-api";

export class AccountCreateStep<T extends AccountCreateContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating account..." });

        const response: CreateAccountResponse = await createAccount(context.token, {
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
