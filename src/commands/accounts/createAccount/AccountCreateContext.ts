import { Account, TaxShelter } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type AccountCreateContext = AuthContext & {
    accountName?: string;
    accountDescription?: string;
    accountInstitution?: string;
    accountTaxShelter?: TaxShelter;

    account?: Account;
};