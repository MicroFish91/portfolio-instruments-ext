import { Account } from "../../../sdk/types/accounts";
import { AccountCreateContext } from "../createAccount/AccountCreateContext";

export type AccountUpdateContext = AccountCreateContext & {
    account: Account; // Make original account info required
    updatedAccount?: Account;
};