import * as vscode from 'vscode';
import { AccountsItem } from '../../tree/accounts/AccountsItem';
import { HoldingsItem } from '../../tree/holdings/HoldingsItem';
import { Account, Holding } from '../../sdk/portfolio-instruments-api';

export class PiExtCodeLensProvider implements vscode.CodeLensProvider {
    static fileSuffix: string = '.pi-snapshot.json';
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

    async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
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

            // Identify the start of an object
            const startPosition: vscode.Position = new vscode.Position(line.lineNumber, startIndexOf);

            // Capture until the end of the object
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

            const email: string = document.fileName.slice(1, -PiExtCodeLensProvider.fileSuffix.length);
            const commandTitle: string | undefined = await this.buildCommandTitle(email, accountId, holdingId);

            if (!commandTitle) {
                continue;
            }

            const range = new vscode.Range(startPosition, endPosition);
            const command: vscode.Command = {
                title: commandTitle,
                command: '',
            };

            codeLenses.push(new vscode.CodeLens(range, command));
        }

        return codeLenses;
    }

    private async buildCommandTitle(email: string, accountId: string, holdingId: string): Promise<string | undefined> {
        const accounts: Account[] = await AccountsItem.getAccountsWithCache(email);
        const account: Account | undefined = accounts.find(a => a.account_id.toString() === accountId);

        const holdings: Holding[] = await HoldingsItem.getHoldingsWithCache(email);
        const holding: Holding | undefined = holdings.find(h => h.holding_id.toString() === holdingId);

        if (!account || !holding) {
            return undefined;
        }

        let commandTitle: string = `${account.institution} | ${account.name} | ${account.tax_shelter}`;
        if (holding.ticker) {
            commandTitle += ` | ${holding.ticker}`;
        }
        commandTitle += ` | ${holding.name}`;

        if (holding.interest_rate_pct) {
            commandTitle += ` | ${holding.interest_rate_pct}%`;
        }
        if (holding.maturation_date) {
            commandTitle += ` | ${holding.maturation_date}`;
        }

        return commandTitle;
    }

    async resolveCodeLens(codeLens: vscode.CodeLens) {
        return codeLens;
    }
}

