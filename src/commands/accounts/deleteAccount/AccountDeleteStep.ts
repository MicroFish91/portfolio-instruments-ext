import { l10n, Progress } from "vscode";
import { AccountDeleteContext } from "./AccountDeleteContext";
import { nonNullProp } from "../../../utils/nonNull";
import { deleteAccount } from "../../../sdk/accounts/deleteAccount";
import { DeleteAccountResponse } from "../../../sdk/portfolio-instruments-api";

export class AccountDeleteStep<T extends AccountDeleteContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Deleting account...") });

        const response: DeleteAccountResponse = await deleteAccount(nonNullProp(context, 'token'), context.account.account_id);
        if (response.error) {
            throw new Error(response.error);
        }
    }

    shouldExecute(context: T): boolean {
        return !!context.account;
    }
}
