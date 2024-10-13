import { CancellationToken, InputBoxOptions, window } from "vscode";

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
}