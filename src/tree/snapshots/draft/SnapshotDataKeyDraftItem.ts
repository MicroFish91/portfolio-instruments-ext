import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { CreateSnapshotPayload } from "../../../sdk/portfolio-instruments-api";

export class SnapshotDataKeyDraftItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDataKeyDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDataKeyDraftItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotDraftItem,
        readonly email: string,

        readonly snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
        readonly key: string,
        readonly value: string,
    ) {
        super(value);
        this.id = `/users/${email}/snapshots/draft/snapshotData/${key}`;
        this.description = key;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: this.description,
            contextValue: SnapshotDataKeyDraftItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("dash", "white"),
        };
    }
}