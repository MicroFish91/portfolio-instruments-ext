import { CancellationToken, InputBoxOptions, MessageOptions, QuickPickItem, QuickPickOptions, window } from "vscode";

export type PiQuickPickItem<T> = QuickPickItem & {
    data: T;
};

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

    showWarningMessage(message: string, options: MessageOptions, ...items: string[]): Thenable<string | undefined> {
        return window.showWarningMessage(message, options, ...items);
    }

    showQuickPick<T extends QuickPickItem>(items: readonly T[] | Thenable<readonly T[]>, options?: QuickPickOptions, token?: CancellationToken): Thenable<T | undefined> {
        return window.showQuickPick(items, options, token);
    }
}