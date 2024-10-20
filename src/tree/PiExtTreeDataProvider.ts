import { Event, EventEmitter, TreeDataProvider, TreeItem } from "vscode";
import { RegisterItem } from "./auth/RegisterItem";
import { LoginItem } from "./auth/LoginItem";
import { getAuthTokenRecord } from "../utils/tokenUtils";
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
            const tokenRecord: Record<string, string> = await getAuthTokenRecord();
            const emails: string[] = Object.keys(tokenRecord);

            if (emails.length) {
                return emails.map(e => new EmailItem(e));
            } else {
                return [
                    new LoginItem(),
                    new RegisterItem(),
                ];
            }
        }
    }

    refresh(item?: PiExtTreeItem) {
        item ? this.onDidChangeTreeDataEmitter.fire(item) : this.onDidChangeTreeDataEmitter.fire(undefined);
    }
}