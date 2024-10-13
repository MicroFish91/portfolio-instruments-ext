import { TreeDataProvider, TreeItem } from "vscode";
import { RegisterItem } from "./auth/RegisterItem";
import { LoginItem } from "./auth/LoginItem";

export interface PiExtTreeItem extends TreeItem {
    getTreeItem(): TreeItem;
    getChildren?(): PiExtTreeItem[] | Promise<PiExtTreeItem[]>;
}

export class PiExtTreeDataProvider implements TreeDataProvider<PiExtTreeItem> {
    getTreeItem(item: PiExtTreeItem): TreeItem {
        return item.getTreeItem();
    }

    async getChildren(item?: PiExtTreeItem): Promise<PiExtTreeItem[] | undefined> {
        if (item) {
            return await item.getChildren?.();
        } else {
            // Check for existing login tokens
            // For each existing login, create a login item 

            // If no tokens, create a click to login command item
            return [
                new LoginItem(),
                new RegisterItem(),
            ];
        }
    }
}