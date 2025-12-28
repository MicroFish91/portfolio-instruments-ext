import { User } from "../../../sdk/portfolio-instruments-api";
import { CommandContext } from "../../registerCommand";

export type LoginContext = CommandContext & {
    email?: string;
    password?: string;

    token?: string;
    user?: User;
};