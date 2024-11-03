import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotItem } from "./SnapshotItem";
import { Snapshot } from "../../../sdk/types/snapshots";
import { SnapshotDataKeyItem } from "./SnapshotDataKeyItem";
import { Benchmark } from "../../../sdk/types/benchmarks";
import { BenchmarksItem } from "../../benchmarks/BenchmarksItem";

export class SnapshotDataItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDataItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDataItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
    ) {
        super('Data');
        this.id = `/emails/${email}/snapshots/${snapshotData.snap_id}/snapshotData`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("json", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarksWithCache(this.email);
        return [
            new SnapshotDataKeyItem(this.parent, this.email, 'snap_date', this.snapshotData.snap_date),
            new SnapshotDataKeyItem(this.parent, this.email, 'description', this.snapshotData.description || '""'),
            new SnapshotDataKeyItem(this.parent, this.email, 'benchmark', benchmarks.find(b => b.benchmark_id === this.snapshotData.benchmark_id)?.name ?? '""'),
            new SnapshotDataKeyItem(this.parent, this.email, 'total', String(this.snapshotData.total.toFixed(2)), false),
            new SnapshotDataKeyItem(this.parent, this.email, 'weighted_er_pct', String(this.snapshotData.weighted_er_pct.toFixed(3)), false),
        ];
    }

    private getContextValues(): string {
        return createContextValue([SnapshotDataItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotData, undefined, 4);
    }
}