import { Account } from "../../../sdk/portfolio-instruments-api";
import { AuthContext } from "../../AuthContext";

export type AccountDeleteContext = AuthContext & {
    account: Account;
};