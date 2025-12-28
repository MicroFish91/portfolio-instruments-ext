import { User } from "../../../sdk/portfolio-instruments-api";
import { CommandContext } from "../../registerCommand";

export type RegisterContext = CommandContext & {
    email?: string;
    password?: string;

    user?: User;
};