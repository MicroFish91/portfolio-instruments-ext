import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotsItem } from "../SnapshotsItem";
import { Snapshot } from "../../../sdk/types/snapshots";
import { SnapshotDataItem } from "./SnapshotDataItem";

export class SnapshotItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotItem';
    static readonly regExp: RegExp = new RegExp(SnapshotItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotsItem,
        readonly email: string,
        readonly snapshot: Snapshot,
    ) {
        super(snapshot.snap_date);
        this.id = `/snapshots/${snapshot.snap_id}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `$${this.snapshot.total}`,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] | Promise<PiExtTreeItem[]> {
        return [
            new SnapshotDataItem(this, this.email, this.snapshot),
        ];
    }

    private getContextValue(): string {
        return createContextValue([SnapshotItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshot, undefined, 4);
    }
}