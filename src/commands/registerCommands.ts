import { login } from "./auth/login/login";
import { logoutAll } from "./auth/logoutAll";
import { register } from "./auth/register/register";
import { registerCommand } from "./registerCommand";

export function registerCommands() {
    // Auth
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
    registerCommand('portfolioInstruments.logoutAll', logoutAll);
}