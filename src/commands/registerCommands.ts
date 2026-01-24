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
import { updateBenchmark } from "./benchmarks/updateBenchmark/updateBenchmark";
import { createSnapshotDraft } from "./draft/snapshot/createSnapshotDraft/createSnapshotDraft";
import { deploySnapshotDraft } from "./draft/snapshot/deploySnapshotDraft/deploySnapshotDraft";
import { discardSnapshotDraft } from "./draft/snapshot/discardSnapshotDraft";
import { editSnapshotDraft } from "./draft/snapshot/editSnapshotDraft";
import { updateSnapshotDraft } from "./draft/snapshot/updateSnapshotDraft/updateSnapshotDraft";
import { createSnapshotValueDraft } from "./draft/snapshotValue/createSnapshotValueDraft/createSnapshotValueDraft";
import { deleteSnapshotValueDraft } from "./draft/snapshotValue/deleteSnapshotValueDraft/deleteSnapshotValueDraft";
import { updateSnapshotValueAmountDraft } from "./draft/snapshotValue/updateSnapshotValueDraft/updateSnapshotValueAmountDraft";
import { updateSnapshotValueDraft } from "./draft/snapshotValue/updateSnapshotValueDraft/updateSnapshotValueDraft";
import { createHolding } from "./holdings/createHolding/createHolding";
import { deleteHolding } from "./holdings/deleteHolding/deleteHolding";
import { updateHolding } from "./holdings/updateHolding/updateHolding";
import { registerCommand } from "./registerCommand";
import { setApiEndpoint } from "./setApiEndpoint/setApiEndpoint";
import { decrementSnapshotPage } from "./snapshots/decrementSnapshotPage";
import { deleteSnapshot } from "./snapshots/deleteSnapshot/deleteSnapshot";
import { incrementSnapshotPage } from "./snapshots/incrementSnapshotPage";
import { plotSnapshots } from "./snapshots/plotSnapshots/plotSnapshots";
import { updateMaturationEnd } from "./snapshots/updateMaturationDate/updateMaturationEnd/updateMaturationEnd";
import { updateMaturationStart } from "./snapshots/updateMaturationDate/updateMaturationStart/updateMaturationStart";
import { updateSnapshot } from "./snapshots/updateSnapshot/updateSnapshot";
import { createSnapshotValue } from "./snapshotValues/createSnapshotValue/createSnapshotValue";
import { deleteSnapshotValue } from "./snapshotValues/deleteSnapshotValue/deleteSnapshotValue";
import { updateSnapshotValue } from "./snapshotValues/updateSnapshotValue/updateSnapshotValue";
import { viewProperties } from "./viewProperties/viewProperties";
import { toggleShowDeprecatedResources } from "./toggleShowDeprecatedResources/toggleShowDeprecatedResources";
import { undeprecate } from "./undeprecate/undeprecate";
import { refresh, refreshNode } from "./refresh/refresh";
import { collapseAll } from "./refresh/collapseAll";

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
    registerCommand('portfolioInstruments.updateBenchmark', updateBenchmark);
    registerCommand('portfolioInstruments.deleteBenchmark', deleteBenchmark);

    // Snapshot draft
    registerCommand('portfolioInstruments.createSnapshotDraft', createSnapshotDraft);
    registerCommand('portfolioInstruments.editSnapshotDraft', editSnapshotDraft);
    registerCommand('portfolioInstruments.discardSnapshotDraft', discardSnapshotDraft);
    registerCommand('portfolioInstruments.updateSnapshotDraft', updateSnapshotDraft);
    registerCommand('portfolioInstruments.deploySnapshotDraft', deploySnapshotDraft);

    // Snapshot values draft
    registerCommand('portfolioInstruments.createSnapshotValueDraft', createSnapshotValueDraft);
    registerCommand('portfolioInstruments.updateSnapshotValueDraft', updateSnapshotValueDraft);
    registerCommand('portfolioInstruments.updateSnapshotValueAmountDraft', updateSnapshotValueAmountDraft);
    registerCommand('portfolioInstruments.deleteSnapshotValueDraft', deleteSnapshotValueDraft);

    // Snapshots
    registerCommand('portfolioInstruments.updateSnapshot', updateSnapshot);
    registerCommand('portfolioInstruments.deleteSnapshot', deleteSnapshot);
    registerCommand('portfolioInstruments.updateMaturationStart', updateMaturationStart);
    registerCommand('portfolioInstruments.updateMaturationEnd', updateMaturationEnd);
    registerCommand('portfolioInstruments.incrementSnapshotPage', incrementSnapshotPage);
    registerCommand('portfolioInstruments.decrementSnapshotPage', decrementSnapshotPage);
    registerCommand('portfolioInstruments.plotSnapshots', plotSnapshots);  // Webview

    // Snapshot values
    registerCommand('portfolioInstruments.createSnapshotValue', createSnapshotValue);
    registerCommand('portfolioInstruments.updateSnapshotValue', updateSnapshotValue);
    registerCommand('portfolioInstruments.deleteSnapshotValue', deleteSnapshotValue);

    // Other
    registerCommand('portfolioInstruments.viewProperties', viewProperties);
    registerCommand('portfolioInstruments.setApiEndpoint', setApiEndpoint);
    registerCommand('portfolioInstruments.toggleShowDeprecatedResources', toggleShowDeprecatedResources);
    registerCommand('portfolioInstruments.undeprecate', undeprecate);

    // Refresh
    registerCommand('portfolioInstruments.refresh', refresh);
    registerCommand('portfolioInstruments.refreshSnapshots', refreshNode);
    registerCommand('portfolioInstruments.refreshAccounts', refreshNode);
    registerCommand('portfolioInstruments.refreshHoldings', refreshNode);
    registerCommand('portfolioInstruments.refreshBenchmarks', refreshNode);
    registerCommand('portfolioInstruments.refreshSnapshot', refreshNode);
    registerCommand('portfolioInstruments.collapseAll', collapseAll);
}