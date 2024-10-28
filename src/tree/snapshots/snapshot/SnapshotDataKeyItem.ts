import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotItem } from "./SnapshotItem";

export class SnapshotDataKeyItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDataKeyItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDataKeyItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,

        readonly key: string,
        readonly value: string,
    ) {
        super(`${key}=${value}`);
        this.id = `/snapshots/${parent.snapshot.snap_id}/snapshotData/${key}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: SnapshotDataKeyItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("dash", "white"),
        };
    }
}