import { commands } from "vscode";
import { register } from "./register/register";
import { login } from "./login/login";

export function registerCommands() {
    commands.registerCommand('portfolioInstruments.register', register);
    commands.registerCommand('portfolioInstruments.login', login);
}