import { TreeDataProvider, TreeItem } from "vscode";
import { RegisterItem } from "./auth/RegisterItem";
import { LoginItem } from "./auth/LoginItem";
import { getTokenRecord } from "../utils/tokenUtils";
import { GenericItem } from "./GenericItem";

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
            const tokenRecord: Record<string, string> = await getTokenRecord();
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
}