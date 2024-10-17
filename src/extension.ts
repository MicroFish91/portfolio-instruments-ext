import { ExtensionContext, window, workspace } from 'vscode';
import { ext } from './extensionVariables';
import { PiExtTreeDataProvider } from './tree/PiExtTreeDataProvider';
import { registerCommands } from './commands/registerCommands';
import { ReadOnlyContentProvider } from './commands/viewProperties/ReadOnlyContentProvider';

export function activate(context: ExtensionContext) {
	ext.context = context;

	ext.portfolioInstrumentsTdp = new PiExtTreeDataProvider();
	context.subscriptions.push(window.createTreeView('portfolioInstruments.main', { treeDataProvider: ext.portfolioInstrumentsTdp }));

	ext.readOnlyProvider = new ReadOnlyContentProvider();
	context.subscriptions.push(workspace.registerTextDocumentContentProvider(ReadOnlyContentProvider.scheme, ext.readOnlyProvider));

	registerCommands();
}

export function deactivate() { }
