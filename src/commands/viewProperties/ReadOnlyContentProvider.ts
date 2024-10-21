import { Event, EventEmitter, TextDocument, TextDocumentContentProvider, Uri, window, workspace } from "vscode";

export class ReadOnlyContentProvider implements TextDocumentContentProvider {
    static scheme: string = 'pi-readonly';
    private contentMap = new Map<string, string>;

    onDidChangeEmitter: EventEmitter<Uri> = new EventEmitter<Uri>();
    onDidChange?: Event<Uri> | undefined = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: Uri): string {
        return this.contentMap.get(uri.path) ?? '';
    }

    addContent(uri: Uri, content: string) {
        this.contentMap.set(uri.path, content);
        this.onDidChangeEmitter.fire(uri);
    }

    async displayContent(uri: Uri): Promise<void> {
        const textDocument: TextDocument = await workspace.openTextDocument(uri);
        await window.showTextDocument(textDocument);
    }

    static getUri(id: string): Uri {
        return Uri.parse(ReadOnlyContentProvider.scheme + ':' + id);
    }
}