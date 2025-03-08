import { DocumentSelector, ExtensionContext, languages, window, workspace } from 'vscode';
import { ext } from './extensionVariables';
import { PiExtTreeDataProvider } from './tree/PiExtTreeDataProvider';
import { registerCommands } from './commands/registerCommands';
import { ReadOnlyContentProvider } from './commands/viewProperties/ReadOnlyContentProvider';
import { SnapshotDraftFileSystem } from './commands/draft/SnapshotDraftFileSystem';
import { PiExtTreeDragAndDropController } from './tree/PiExtTreeDragAndDropController';
import { PiExtCodeLensProvider } from './commands/draft/PiExtCodeLensProvider';

export function activate(context: ExtensionContext) {
	ext.context = context;
	ext.resourceCache = new Map<string, any>();

	const documentSelector: DocumentSelector = { scheme: SnapshotDraftFileSystem.scheme, pattern: '**/*.pi-snapshot.json' };
	context.subscriptions.push(languages.registerCodeLensProvider(documentSelector, new PiExtCodeLensProvider()));

	ext.portfolioInstrumentsTdp = new PiExtTreeDataProvider();
	context.subscriptions.push(window.createTreeView('portfolioInstruments.main', {
		treeDataProvider: ext.portfolioInstrumentsTdp,
		dragAndDropController: new PiExtTreeDragAndDropController(),
		canSelectMany: true,
	}));

	ext.readOnlyProvider = new ReadOnlyContentProvider();
	context.subscriptions.push(workspace.registerTextDocumentContentProvider(ReadOnlyContentProvider.scheme, ext.readOnlyProvider));

	ext.snapshotDraftFileSystem = new SnapshotDraftFileSystem();
	context.subscriptions.push(workspace.registerFileSystemProvider(SnapshotDraftFileSystem.scheme, ext.snapshotDraftFileSystem));

	registerCommands();
}

export function deactivate() { }
