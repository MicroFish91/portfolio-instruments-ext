import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotItem } from "./SnapshotItem";
import { Snapshot } from "../../../sdk/types/snapshots";
import { SnapshotRebalanceItem } from "./SnapshotRebalanceItem";

export class SnapshotDashboardItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDashboardItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDashboardItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
    ) {
        super('Dashboard');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: SnapshotDashboardItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("graph", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] {
        // Get by Tax Shelter
        // Get by Accounts
        return [
            new SnapshotRebalanceItem(this.parent, this.email, this.snapshotData),
        ];
    }
}