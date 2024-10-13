import { ExtensionContext, window } from 'vscode';
import { ext } from './extensionVariables';
import { PiExtTreeDataProvider } from './tree/PiExtTreeDataProvider';
import { registerCommands } from './commands/registerCommands';

export function activate(context: ExtensionContext) {
	console.log('Portfolio Instruments activated!');

	ext.context = context;
	ext.portfolioInstrumentsTdp = new PiExtTreeDataProvider();
	context.subscriptions.push(window.createTreeView('portfolioInstruments.main', { treeDataProvider: ext.portfolioInstrumentsTdp }));

	registerCommands();
}

export function deactivate() { }
