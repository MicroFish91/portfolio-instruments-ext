import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../SnapshotItem";
import { Snapshot, SnapshotValue } from "../../../../sdk/types/snapshots";
import { SnapshotRebalanceItem } from "./SnapshotRebalanceItem";
import { SnapshotAccountsItem } from "./SnapshotAccountsItem";

export class SnapshotDashboardItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDashboardItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDashboardItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly snapshotValues: SnapshotValue[],
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
        // Get by Asset Category
        return [
            new SnapshotAccountsItem(this.parent, this.email, this.snapshotData, this.snapshotValues),
            new SnapshotRebalanceItem(this.parent, this.email, this.snapshotData),
        ];
    }
}