import { createAccount } from "./accounts/createAccount/createAccount";
import { deleteAccount } from "./accounts/deleteAccount/deleteAccount";
import { login } from "./auth/login/login";
import { loginExisting } from "./auth/login/loginExisting";
import { logout } from "./auth/logout/logout";
import { logoutAll } from "./auth/logout/logoutAll";
import { register } from "./auth/register/register";
import { registerCommand } from "./registerCommand";
import { viewProperties } from "./viewProperties/viewProperties";

export function registerCommands() {
    // Auth
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
    registerCommand('portfolioInstruments.loginExisting', loginExisting);
    registerCommand('portfolioInstruments.logout', logout);
    registerCommand('portfolioInstruments.logoutAll', logoutAll);

    // Accounts
    registerCommand('portfolioInstruments.createAccount', createAccount);
    registerCommand('portfolioInstruments.deleteAccount', deleteAccount);

    // Other
    registerCommand('portfolioInstruments.viewProperties', viewProperties);
}