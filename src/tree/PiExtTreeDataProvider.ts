import { Event, EventEmitter, TreeDataProvider, TreeItem } from "vscode";
import { RegisterItem } from "./auth/RegisterItem";
import { LoginItem } from "./auth/LoginItem";
import { getAuthTokenRecord, hasAuthTokenRecord } from "../utils/tokenUtils";
import { EmailItem } from "./auth/EmailItem";

export interface PiExtTreeItem extends TreeItem {
    getTreeItem(): TreeItem;
    getChildren?(): PiExtTreeItem[] | Promise<PiExtTreeItem[]>;
    viewProperties?(): string | Promise<string>;
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
            if (await hasAuthTokenRecord()) {
                const tokenRecord: Record<string, string> = await getAuthTokenRecord();
                return Object.keys(tokenRecord).map(email => new EmailItem(email));
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