import { AuthContext } from "../../../AuthContext";
import { Account, TaxShelter } from "../../../sdk/types/accounts";

export type AccountCreateContext = AuthContext & {
    accountName?: string;
    accountDescription?: string;
    accountInstitution?: string;
    accountTaxShelter?: TaxShelter;

    account?: Account;
};