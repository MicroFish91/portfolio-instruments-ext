import { InputBoxOptions, MessageOptions, QuickPickItem, QuickPickOptions, window } from "vscode";
import { operationCancelled } from "../constants";
import { showInputBox } from "./showInputBox";
import { showQuickPick } from "./showQuickPick";

export type PiQuickPickItem<T> = QuickPickItem & {
    data: T;
};

export class UserInterface {
    showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined> {
        return window.showInformationMessage(message, ...items);
    }

    async showInputBox(options: InputBoxOptions): Promise<string> {
        return await showInputBox(options);
    }

    async showWarningMessage(message: string, options: MessageOptions, ...items: string[]): Promise<string | undefined> {
        const result = await window.showWarningMessage(message, options, ...items);
        if (!result) {
            throw new Error(operationCancelled);
        }
        return result;
    }

    showQuickPick<T extends QuickPickItem>(items: readonly T[] | Thenable<readonly T[]>, options?: QuickPickOptions): Thenable<T | undefined>;
    showQuickPick<T extends QuickPickItem>(items: readonly T[] | Thenable<readonly T[]>, options: QuickPickOptions & { canPickMany: true }): Thenable<T[] | undefined>;

    async showQuickPick<T extends QuickPickItem>(items: T[], options?: QuickPickOptions): Promise<T | T[] | undefined> {
        return await showQuickPick<T>(items, options);
    }
}