import { createAccount } from "./accounts/createAccount/createAccount";
import { deleteAccount } from "./accounts/deleteAccount/deleteAccount";
import { updateAccount } from "./accounts/updateAccount/updateAccount";
import { login } from "./auth/login/login";
import { refreshLogin } from "./auth/login/refreshLogin";
import { logout } from "./auth/logout/logout";
import { logoutAll } from "./auth/logout/logoutAll";
import { register } from "./auth/register/register";
import { createBenchmark } from "./benchmarks/createBenchmark/createBenchmark";
import { deleteBenchmark } from "./benchmarks/deleteBenchmark/deleteBenchmark";
import { createHolding } from "./holdings/createHolding/createHolding";
import { deleteHolding } from "./holdings/deleteHolding/deleteHolding";
import { updateHolding } from "./holdings/updateHolding/updateHolding";
import { registerCommand } from "./registerCommand";
import { createSnapshotDraft } from "./snapshotDraft/createSnapshotDraft/createSnapshotDraft";
import { deploySnapshotDraft } from "./snapshotDraft/deploySnapshotDraft/deploySnapshotDraft";
import { discardSnapshotDraft } from "./snapshotDraft/discardSnapshotDraft";
import { editSnapshotDraft } from "./snapshotDraft/editSnapshotDraft";
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
    registerCommand('portfolioInstruments.updateAccount', updateAccount);
    registerCommand('portfolioInstruments.deleteAccount', deleteAccount);

    // Holdings
    registerCommand('portfolioInstruments.createHolding', createHolding);
    registerCommand('portfolioInstruments.updateHolding', updateHolding);
    registerCommand('portfolioInstruments.deleteHolding', deleteHolding);

    // Benchmarks 
    registerCommand('portfolioInstruments.createBenchmark', createBenchmark);
    registerCommand('portfolioInstruments.deleteBenchmark', deleteBenchmark);

    // Snapshot draft
    registerCommand('portfolioInstruments.createSnapshotDraft', createSnapshotDraft);
    registerCommand('portfolioInstruments.editSnapshotDraft', editSnapshotDraft);
    registerCommand('portfolioInstruments.discardSnapshotDraft', discardSnapshotDraft);
    registerCommand('portfolioInstruments.deploySnapshotDraft', deploySnapshotDraft);

    // Other
    registerCommand('portfolioInstruments.viewProperties', viewProperties);
}