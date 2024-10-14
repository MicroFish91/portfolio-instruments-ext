import { Event, EventEmitter, TreeDataProvider, TreeItem } from "vscode";
import { RegisterItem } from "./auth/RegisterItem";
import { LoginItem } from "./auth/LoginItem";
import { getAuthTokenRecord } from "../utils/tokenUtils";
import { GenericItem } from "./GenericItem";

export interface PiExtTreeItem extends TreeItem {
    getTreeItem(): TreeItem;
    getChildren?(): PiExtTreeItem[] | Promise<PiExtTreeItem[]>;
}

export class PiExtTreeDataProvider implements TreeDataProvider<PiExtTreeItem> {
    private readonly onDidChangeTreeDataEmitter = new EventEmitter<PiExtTreeItem | PiExtTreeItem[] | undefined | null | void>();
    onDidChangeTreeData: Event<PiExtTreeItem | PiExtTreeItem[] | undefined | null | void> = this.onDidChangeTreeDataEmitter.event;

    getTreeItem(item: PiExtTreeItem): TreeItem {
        return item.getTreeItem();
    }

    async getChildren(item?: PiExtTreeItem): Promise<PiExtTreeItem[] | undefined> {
        if (item) {
            return await item.getChildren?.();
        } else {
            const tokenRecord: Record<string, string> = await getAuthTokenRecord();
            if (Object.keys(tokenRecord).length) {
                return [
                    new GenericItem({
                        id: 'pi/signed-in',
                        label: "Placeholder: Signed in successfully!",
                        contextValue: 'signedInItem',
                    }),
                ];
            } else {
                return [
                    new LoginItem(),
                    new RegisterItem(),
                ];
            }
        }
    }

    refresh() {
        this.onDidChangeTreeDataEmitter.fire(undefined);
    }
}