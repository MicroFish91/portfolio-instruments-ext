import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { SnapshotDataKeyDraftItem } from "./SnapshotDataKeyDraftItem";
import { BenchmarksItem } from "../../benchmarks/BenchmarksItem";
import { Benchmark, CreateSnapshotPayload } from "../../../sdk/portfolio-instruments-api";

export class SnapshotDataDraftItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDataDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDataDraftItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotDraftItem,
        readonly email: string,
        readonly snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
    ) {
        super('Data');
        this.id = `/users/${email}/snapshots/draft/snapshotData`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.Expanded,
            iconPath: new ThemeIcon("json", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const benchmarks: Benchmark[] = await BenchmarksItem.getBenchmarksWithCache(this.email);
        return [
            new SnapshotDataKeyDraftItem(this.parent, this.email, this.snapshotData, 'snap_date', this.snapshotData.snap_date),
            new SnapshotDataKeyDraftItem(this.parent, this.email, this.snapshotData, 'description', this.snapshotData.description || '""'),
            new SnapshotDataKeyDraftItem(this.parent, this.email, this.snapshotData, 'benchmark', benchmarks.find(b => b.benchmark_id === this.snapshotData.benchmark_id)?.name ?? '""'),
            new SnapshotDataKeyDraftItem(this.parent, this.email, this.snapshotData, 'rebalance_threshold_pct', this.snapshotData.rebalance_threshold_pct?.toString() ?? ''),
        ];
    }

    private getContextValues(): string {
        return createContextValue([SnapshotDataDraftItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotData, undefined, 4);
    }
}