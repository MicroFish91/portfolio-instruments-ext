import { Disposable, QuickPick, QuickPickItem, QuickPickOptions, window } from "vscode";
import { operationCancelled } from "../constants";

export async function showQuickPick<T extends QuickPickItem>(picks: T[], options?: QuickPickOptions): Promise<T | T[] | undefined> {
    const disposables: Disposable[] = [];

    try {
        const quickPick: QuickPick<T> = window.createQuickPick();
        quickPick.title = options?.title;
        quickPick.placeholder = options?.placeHolder;
        quickPick.canSelectMany = !!options?.canPickMany;
        quickPick.matchOnDetail = !!options?.matchOnDetail;
        quickPick.matchOnDescription = !!options?.matchOnDescription;
        quickPick.ignoreFocusOut = options?.ignoreFocusOut ?? true;

        return await new Promise<T | T[] | undefined>(async (resolve, reject) => {
            disposables.push(
                quickPick.onDidAccept(() => {
                    try {
                        if (options?.canPickMany) {
                            resolve(Array.from(quickPick.selectedItems));
                        } else {
                            const selectedItem: T | undefined = quickPick.selectedItems[0];
                            if (selectedItem) {
                                resolve(selectedItem);
                            }
                        }
                    } catch (error) {
                        reject(error);
                    }
                }),
                quickPick.onDidHide(() => {
                    reject(new Error(operationCancelled));
                }),
                quickPick,
            );

            quickPick.items = picks;
            quickPick.show();
        });
    } finally {
        disposables.forEach(d => d.dispose());
    }
}