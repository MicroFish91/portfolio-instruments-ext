import * as vscode from 'vscode';

export class PiExtCodeLensProvider implements vscode.CodeLensProvider {
    static fileSuffix: string = 'pi-snapshot.json';
    private openDocuments: Set<string> = new Set();

    private onDidChangeCodeLensEmitter: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLens: vscode.Event<void> = this.onDidChangeCodeLensEmitter.event;

    constructor() {
        vscode.workspace.onDidOpenTextDocument((document) => {
            if (document.fileName.endsWith(PiExtCodeLensProvider.fileSuffix) && !this.openDocuments.has(document.fileName)) {
                this.openDocuments.add(document.fileName);
                this.onDidChangeCodeLensEmitter.fire();
            }
        });
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (document.fileName.endsWith(PiExtCodeLensProvider.fileSuffix)) {
                this.onDidChangeCodeLensEmitter.fire();
            }
        });
        vscode.workspace.onDidCloseTextDocument((document) => {
            if (document.fileName.endsWith(PiExtCodeLensProvider.fileSuffix)) {
                this.openDocuments.delete(document.fileName);
                this.onDidChangeCodeLensEmitter.fire();
            }
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        if (!document.fileName.endsWith(PiExtCodeLensProvider.fileSuffix)) {
            return [];
        }

        const codeLenses: vscode.CodeLens[] = [];

        const text: string = document.getText();
        const lines: string[] = text.split('\n');

        for (let l = 0; l < lines.length; l++) {
            if (token.isCancellationRequested) {
                return [];
            }

            const line: vscode.TextLine = document.lineAt(l);
            const startIndexOf: number = line.text.indexOf('{');

            if (startIndexOf === -1) {
                continue;
            }

            const startPosition: vscode.Position = new vscode.Position(line.lineNumber, startIndexOf);

            let accountId: string | undefined;
            let holdingId: string | undefined;
            let endPosition: vscode.Position | undefined;
            while (true) {
                l++;
                if (l >= lines.length) {
                    break;
                }

                const line: vscode.TextLine = document.lineAt(l);

                // example - "account_id": 7,
                if (line.text.includes('account_id')) {
                    const acc = /"account_id": (\d+)/.exec(line.text);
                    if (acc && acc[1]) {
                        accountId = acc[1];
                    }
                }

                // example - "holding_id": 10, 
                if (line.text.includes('holding_id')) {
                    const hold = /"holding_id": (\d+)/.exec(line.text);
                    if (hold && hold[1]) {
                        holdingId = hold[1];
                    }
                }

                const endIndexOf: number = line.text.indexOf('}');
                if (endIndexOf !== -1) {
                    endPosition = new vscode.Position(line.lineNumber, endIndexOf);
                    break;
                }
            }

            if (!endPosition) {
                break;
            }
            if (!accountId || !holdingId) {
                continue;
            }

            // Todo: Look up the name of the account and holding using the accountId and holdingId
            const range = new vscode.Range(startPosition, endPosition);
            const command: vscode.Command = {
                title: `accountId: ${accountId}, holdingId: ${holdingId}`,
                command: "",
            };

            codeLenses.push(new vscode.CodeLens(range, command));
        }

        return codeLenses;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens) {
        // Everything is already resolved, so just send as-is
        return codeLens;
    }
}

