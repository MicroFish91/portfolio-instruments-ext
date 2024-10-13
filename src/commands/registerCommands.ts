import { login } from "./login/login";
import { register } from "./register/register";
import { registerCommand } from "./registerCommand";

export function registerCommands() {
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
}