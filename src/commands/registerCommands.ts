import { createAccount } from "./accounts/createAccount/createAccount";
import { login } from "./auth/login/login";
import { logout } from "./auth/logout/logout";
import { logoutAll } from "./auth/logout/logoutAll";
import { register } from "./auth/register/register";
import { registerCommand } from "./registerCommand";
import { viewProperties } from "./viewProperties/viewProperties";

export function registerCommands() {
    // Auth
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
    registerCommand('portfolioInstruments.logout', logout);
    registerCommand('portfolioInstruments.logoutAll', logoutAll);

    // Accounts
    registerCommand('portfolioInstruments.createAccount', createAccount);

    // Other
    registerCommand('portfolioInstruments.viewProperties', viewProperties);
}