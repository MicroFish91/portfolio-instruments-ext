import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../SnapshotItem";
import { Snapshot, SnapshotValue } from "../../../../sdk/types/snapshots";
import { SnapshotRebalanceItem } from "./SnapshotRebalanceItem";
import { SnapshotByAccountsItem } from "./SnapshotByAccountsItem";
import { SnapshotByTaxShelterItem } from "./SnapshotByTaxShelterItem";
import { SnapshotByAssetCategoryItem } from "./SnapshotByAssetCategoryItem";
import { SnapshotByMaturationDateItem } from "./maturationDate/SnapshotByMaturationDateItem";

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
            iconPath: new ThemeIcon("dashboard", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] {
        return [
            new SnapshotByAccountsItem(this.parent, this.email, this.snapshotData, this.snapshotValues),
            new SnapshotByTaxShelterItem(this.parent, this.email, this.snapshotData, this.snapshotValues),
            new SnapshotByMaturationDateItem(this.parent, this.email, this.snapshotData, this.snapshotValues),
            new SnapshotByAssetCategoryItem(this.parent, this.email, this.snapshotData, this.snapshotValues),
            new SnapshotRebalanceItem(this.parent, this.email, this.snapshotData),
        ];
    }
}