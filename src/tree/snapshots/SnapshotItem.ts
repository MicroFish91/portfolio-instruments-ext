import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { SnapshotsItem } from "./SnapshotsItem";
import { Snapshot } from "../../sdk/types/snapshots";

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
        this.id = `/emails/${email}/snapshots/${snapshot.snap_date}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `$${this.snapshot.total}`,
            contextValue: this.getContextValue(),
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }

    private getContextValue(): string {
        return createContextValue([SnapshotItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshot, undefined, 4);
    }
}