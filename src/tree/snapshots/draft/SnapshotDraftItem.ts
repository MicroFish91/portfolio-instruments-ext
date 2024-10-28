import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotsItem } from "../SnapshotsItem";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../../sdk/snapshots/createSnapshot";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotValuesPayloadItem } from "./SnapshotValuesPayloadItem";
import { SnapshotPayloadItem } from "./SnapshotPayloadItem";

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
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.Expanded,
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] {
        return [
            new SnapshotPayloadItem(this, this.email, this.snapshotPayload),
            new SnapshotValuesPayloadItem(this, this.email, this.snapshotValues),
        ];
    }

    private getContextValues(): string {
        return createContextValue([SnapshotDraftItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(
            { ...this.snapshotPayload, snapshot_values: this.snapshotValues },
            undefined,
            4,
        );
    }
}