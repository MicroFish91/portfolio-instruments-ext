import { AuthContext } from "../../../AuthContext";
import { Account } from "../../../sdk/types/accounts";

export type AccountDeleteContext = AuthContext & {
    account: Account;
};