import { CommandContext } from "./registerCommand";

export type AuthContext = CommandContext & {
    token: string;
};