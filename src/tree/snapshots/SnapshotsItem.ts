import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { nonNullValue } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { Snapshot } from "../../sdk/types/snapshots";
import { getSnapshots, GetSnapshotsApiResponse } from "../../sdk/snapshots/getSnapshots";
import { SnapshotItem } from "./SnapshotItem";
import { ext } from "../../extensionVariables";
import { CreateSnapshotPayload } from "../../sdk/snapshots/createSnapshot";
import { SnapshotDraftItem } from "./draft/SnapshotDraftItem";
import { Settings } from "../../sdk/types/settings";

export class SnapshotsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotsItem';
    static readonly regExp: RegExp = new RegExp(SnapshotsItem.contextValue);

    constructor(
        readonly email: string,
        readonly settings: Settings,
    ) {
        super(l10n.t('Snapshots'));
        this.email = email; this.id = `/emails/${email}/snapshots`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        let snapshotDraft: CreateSnapshotPayload | undefined;
        if (ext.snapshotDraftFileSystem.hasSnapshotDraft(this.email)) {
            snapshotDraft = ext.snapshotDraftFileSystem.parseSnapshotDraft(this.email);
        }

        const snapshots: Snapshot[] = await this.getSnapshots();
        return snapshotDraft ?
            [
                new SnapshotDraftItem(this, this.email, { ...snapshotDraft, snapshot_values: undefined } as Omit<CreateSnapshotPayload, 'snapshot_values'>, snapshotDraft.snapshot_values),
                ...snapshots.map(s => new SnapshotItem(this, this.email, s))
            ] :
            snapshots.map(s => new SnapshotItem(this, this.email, s));
    }

    private getContextValue(): string {
        return createContextValue([SnapshotsItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        const snapshots: Snapshot[] = await this.getSnapshots();
        return JSON.stringify(snapshots, undefined, 4);
    }

    private async getSnapshots(): Promise<Snapshot[]> {
        const response: GetSnapshotsApiResponse = await getSnapshots(nonNullValue(await getAuthToken(this.email)));
        return response.data?.snapshots ?? [];
    }
}