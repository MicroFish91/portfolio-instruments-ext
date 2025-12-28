import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { SnapshotMaturationStartItem } from "./SnapshotMaturationStartItem";
import { SnapshotMaturationEndItem } from "./SnapshotMaturationEndItem";
import { SnapshotByMaturationDateItem } from "./SnapshotByMaturationDateItem";
import { GetSnapshotMaturationDateOptions } from "../../../../../sdk/snapshots/getSnapshotByMaturationDate";
import { Snapshot } from "../../../../../sdk/portfolio-instruments-api";

export class SnapshotMaturationFilterItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotMaturationFilterItem';
    static readonly regExp: RegExp = new RegExp(SnapshotMaturationFilterItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotByMaturationDateItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
    ) {
        super('Filter');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/maturationDateBreakdown/filter`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: SnapshotMaturationFilterItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("gear", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const options: GetSnapshotMaturationDateOptions = {
            startDate: SnapshotMaturationStartItem.getMaturationStart(this.email, this.snapshotData.snap_id),
            endDate: SnapshotMaturationEndItem.getMaturationEnd(this.email, this.snapshotData.snap_id),
        };

        return [
            new SnapshotMaturationStartItem(this.parent, this.email, this.snapshotData, options.startDate ?? 'mm/dd/yyyy'),
            new SnapshotMaturationEndItem(this.parent, this.email, this.snapshotData, options.endDate ?? 'mm/dd/yyyy'),
        ];
    }
}