import { createAccount } from "./accounts/createAccount/createAccount";
import { deleteAccount } from "./accounts/deleteAccount/deleteAccount";
import { login } from "./auth/login/login";
import { refreshLogin } from "./auth/login/refreshLogin";
import { logout } from "./auth/logout/logout";
import { logoutAll } from "./auth/logout/logoutAll";
import { register } from "./auth/register/register";
import { createHolding } from "./holdings/createHolding/createHolding";
import { deleteHolding } from "./holdings/deleteHolding/deleteHolding";
import { registerCommand } from "./registerCommand";
import { viewProperties } from "./viewProperties/viewProperties";

export function registerCommands() {
    // Auth
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
    registerCommand('portfolioInstruments.refreshLogin', refreshLogin);
    registerCommand('portfolioInstruments.logout', logout);
    registerCommand('portfolioInstruments.logoutAll', logoutAll);

    // Accounts
    registerCommand('portfolioInstruments.createAccount', createAccount);
    registerCommand('portfolioInstruments.deleteAccount', deleteAccount);

    // Holdings
    registerCommand('portfolioInstruments.createHolding', createHolding);
    registerCommand('portfolioInstruments.deleteHolding', deleteHolding);

    // Other
    registerCommand('portfolioInstruments.viewProperties', viewProperties);
}