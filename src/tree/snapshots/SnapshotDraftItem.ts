import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { SnapshotsItem } from "./SnapshotsItem";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../sdk/snapshots/createSnapshot";

export class SnapshotDraftItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDraftItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotsItem,
        readonly email: string,
        readonly snapshotPayload: Omit<CreateSnapshotPayload, 'snapshot_values'>,
        readonly snapshotValues: CreateSnapshotValuePayload[],
    ) {
        super(snapshotPayload.snap_date);
        this.id = `/emails/${email}/snapshots/draft`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: l10n.t('Draft'),
            contextValue: SnapshotDraftItem.contextValue,
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }
}