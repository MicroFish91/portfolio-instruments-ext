import { login } from "./auth/login/login";
import { register } from "./auth/register/register";
import { registerCommand } from "./registerCommand";

export function registerCommands() {
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
}