import { Account, TaxShelter } from "../../../sdk/types/accounts";
import { CommandContext } from "../../registerCommand";

export type AccountCreateContext = CommandContext & {
    token: string;

    accountName?: string;
    accountDescription?: string;
    accountInstitution?: string;
    accountTaxShelter?: TaxShelter;

    account?: Account;
};