import { CommandContext } from "./commands/registerCommand";

export type AuthContext = CommandContext & {
    token: string;
};