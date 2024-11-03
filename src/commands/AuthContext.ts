import { CommandContext } from "./registerCommand";

export type AuthContext = CommandContext & {
    email: string;
    token: string;
};