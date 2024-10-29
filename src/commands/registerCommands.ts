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
import { updateBenchmarkSettings } from "./settings/updateBenchmarkSettings/updateBenchmarkSettings";
import { createSnapshotDraft } from "./snapshotDraft/createSnapshotDraft/createSnapshotDraft";
import { deploySnapshotDraft } from "./snapshotDraft/deploySnapshotDraft/deploySnapshotDraft";
import { discardSnapshotDraft } from "./snapshotDraft/discardSnapshotDraft";
import { editSnapshotDraft } from "./snapshotDraft/editSnapshotDraft";
import { updateSnapshotDraft } from "./snapshotDraft/updateSnapshotDraft/updateSnapshotDraft";
import { deleteSnapshot } from "./snapshots/deleteSnapshot/deleteSnapshot";
import { updateSnapshot } from "./snapshots/updateSnapshot/updateSnapshot";
import { createSnapshotValue } from "./snapshotValues/createSnapshotValue/createSnapshotValue";
import { deleteSnapshotValue } from "./snapshotValues/deleteSnapshotValue/deleteSnapshotValue";
import { updateSnapshotValue } from "./snapshotValues/updateSnapshotValue/updateSnapshotValue";
import { viewProperties } from "./viewProperties/viewProperties";

export function registerCommands() {
    // Auth
    registerCommand('portfolioInstruments.register', register);
    registerCommand('portfolioInstruments.login', login);
    registerCommand('portfolioInstruments.refreshLogin', refreshLogin);
    registerCommand('portfolioInstruments.logout', logout);
    registerCommand('portfolioInstruments.logoutAll', logoutAll);

    // Settings
    registerCommand('portfolioInstruments.updateBenchmarkSettings', updateBenchmarkSettings);
    // Todo: Update rebalance threshold

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
    // Todo: Update benchmark
    registerCommand('portfolioInstruments.deleteBenchmark', deleteBenchmark);

    // Snapshot draft
    registerCommand('portfolioInstruments.createSnapshotDraft', createSnapshotDraft);
    registerCommand('portfolioInstruments.editSnapshotDraft', editSnapshotDraft);
    registerCommand('portfolioInstruments.discardSnapshotDraft', discardSnapshotDraft);
    registerCommand('portfolioInstruments.updateSnapshotDraft', updateSnapshotDraft);
    registerCommand('portfolioInstruments.deploySnapshotDraft', deploySnapshotDraft);

    // Snapshots
    // Todo: View Rebalance
    // Todo: View Breakdowns by ___....
    registerCommand('portfolioInstruments.updateSnapshot', updateSnapshot);
    registerCommand('portfolioInstruments.deleteSnapshot', deleteSnapshot);

    // Snapshot values
    registerCommand('portfolioInstruments.createSnapshotValue', createSnapshotValue);
    registerCommand('portfolioInstruments.updateSnapshotValue', updateSnapshotValue);
    registerCommand('portfolioInstruments.deleteSnapshotValue', deleteSnapshotValue);

    // Other
    registerCommand('portfolioInstruments.viewProperties', viewProperties);
    // Todo: Add ability to quickly scaffold snapshot value while in edit mode...
}