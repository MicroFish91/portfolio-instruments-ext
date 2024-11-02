import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotsItem } from "../SnapshotsItem";
import { Snapshot, SnapshotValue } from "../../../sdk/types/snapshots";
import { SnapshotDataItem } from "./SnapshotDataItem";
import { nonNullValue } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { getSnapshot } from "../../../sdk/snapshots/getSnapshot";
import { SnapshotValuesItem } from "./SnapshotValuesItem";
import { SnapshotDashboardItem } from "./SnapshotDashboardItem";

export class SnapshotItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotItem';
    static readonly regExp: RegExp = new RegExp(SnapshotItem.contextValue);

    id: string;
    snapshot: Snapshot;
    snapshotValues: SnapshotValue[];

    constructor(
        readonly parent: SnapshotsItem,
        readonly email: string,

        snapshot: Snapshot,
    ) {
        super(snapshot.snap_date);
        this.id = `/snapshots/${snapshot.snap_id}`;
        this.snapshot = snapshot;
    }

    async getTreeItem(): Promise<TreeItem> {
        const { snapshot, snapshot_values } = await SnapshotItem.getSnapshot(this.email, this.snapshot.snap_id);
        this.snapshot = snapshot ?? this.snapshot;
        this.snapshotValues = snapshot_values ?? this.snapshotValues;

        return {
            id: this.id,
            label: this.snapshot.snap_date,
            description: `$${this.snapshot.total}`,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] {
        return [
            new SnapshotDashboardItem(this, this.email, this.snapshot),
            new SnapshotDataItem(this, this.email, this.snapshot),
            new SnapshotValuesItem(this, this.email, this.snapshot, this.snapshotValues),
        ];
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshot, undefined, 4);
    }

    private getContextValue(): string {
        return createContextValue([SnapshotItem.contextValue, viewPropertiesContext]);
    }

    static async getSnapshot(email: string, snapshotId: number) {
        const response = await getSnapshot(nonNullValue(await getAuthToken(email)), snapshotId);

        // Explicitly build the object out so that it can be easily destructured as needed
        return {
            snapshot: response.data?.snapshot,
            snapshot_values: response.data?.snapshot_values,
            accounts: response.data?.accounts,
            holdings: response.data?.holdings,
        };
    }
}