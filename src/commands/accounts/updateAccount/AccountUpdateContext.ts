import { Account } from "../../../sdk/portfolio-instruments-api";
import { AccountCreateContext } from "../createAccount/AccountCreateContext";

export type AccountUpdateContext = AccountCreateContext & {
    account: Account; // Make original account info required
    updatedAccount?: Account;
};