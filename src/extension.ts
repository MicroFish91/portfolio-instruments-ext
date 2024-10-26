import { ExtensionContext, window, workspace } from 'vscode';
import { ext } from './extensionVariables';
import { PiExtTreeDataProvider } from './tree/PiExtTreeDataProvider';
import { registerCommands } from './commands/registerCommands';
import { ReadOnlyContentProvider } from './commands/viewProperties/ReadOnlyContentProvider';
import { SnapshotDraftFileSystem } from './commands/snapshotDraft/SnapshotDraftFileSystem';

export function activate(context: ExtensionContext) {
	ext.context = context;

	ext.portfolioInstrumentsTdp = new PiExtTreeDataProvider();
	context.subscriptions.push(window.createTreeView('portfolioInstruments.main', { treeDataProvider: ext.portfolioInstrumentsTdp }));

	ext.readOnlyProvider = new ReadOnlyContentProvider();
	context.subscriptions.push(workspace.registerTextDocumentContentProvider(ReadOnlyContentProvider.scheme, ext.readOnlyProvider));

	ext.snapshotDraftFileSystem = new SnapshotDraftFileSystem();
	context.subscriptions.push(workspace.registerFileSystemProvider(SnapshotDraftFileSystem.scheme, ext.snapshotDraftFileSystem));

	registerCommands();
}

export function deactivate() { }
