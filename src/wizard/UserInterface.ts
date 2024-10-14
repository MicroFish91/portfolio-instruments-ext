import { CancellationToken, InputBoxOptions, QuickPickItem, QuickPickOptions, window } from "vscode";

/**
 * Injected wrapper for common VS Code UI commands
 */
export class UserInterface {
    showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined> {
        return window.showInformationMessage(message, ...items);
    }

    showInputBox(options: InputBoxOptions, token?: CancellationToken): Thenable<string | undefined> {
        return window.showInputBox(options, token);
    }

    showQuickPick<T extends QuickPickItem>(items: readonly T[] | Thenable<readonly T[]>, options?: QuickPickOptions, token?: CancellationToken): Thenable<T | undefined> {
        return window.showQuickPick(items, options, token);
    }
}