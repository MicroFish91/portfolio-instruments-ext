import { Settings } from "../../sdk/types/settings";
import { User } from "../../sdk/types/user";
import { CommandContext } from "../registerCommand";

export type RegisterContext = CommandContext & {
    email?: string;
    password?: string;

    user?: User;
    settings?: Settings;
};