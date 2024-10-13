import { Settings } from "../../../sdk/types/settings";
import { User } from "../../../sdk/types/user";
import { CommandContext } from "../../registerCommand";

export type LoginContext = CommandContext & {
    email?: string;
    password?: string;

    token?: string;
    user?: User;
    settings?: Settings;
};