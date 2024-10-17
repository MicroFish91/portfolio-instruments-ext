import { TextDocument, TextDocumentContentProvider, Uri, window, workspace } from "vscode";

export class ReadOnlyContentProvider implements TextDocumentContentProvider {
    static scheme: string = 'pi-readonly';
    private contentMap = new Map<string, string>;

    provideTextDocumentContent(uri: Uri): string {
        return this.contentMap.get(uri.path) ?? '';
    }

    addContent(uri: Uri, content: string) {
        this.contentMap.set(uri.path, content);
    }

    async displayContent(uri: Uri): Promise<void> {
        const textDocument: TextDocument = await workspace.openTextDocument(uri);
        await window.showTextDocument(textDocument, { preview: false });
    }

    static getUri(id: string): Uri {
        return Uri.parse(ReadOnlyContentProvider.scheme + ':' + id);
    }
}