import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotsItem } from "../SnapshotsItem";
import { CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../../sdk/snapshots/createSnapshot";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotDataDraftItem } from "./SnapshotDataDraftItem";
import { SnapshotValuesDraftItem } from "./SnapshotValuesDraftItem";
import { ext } from "../../../extensionVariables";
import { SnapshotByAccountsDraftItem } from "./SnapshotByAccountsDraftItem";

export class SnapshotDraftItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotDraftItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotsItem,
        readonly email: string,

        public snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
        public snapshotValues: CreateSnapshotValuePayload[],
    ) {
        super(snapshotData.snap_date);
        this.id = `/users/${email}/snapshots/draft`;
    }

    getTreeItem(): TreeItem {
        const snapshotDraft: CreateSnapshotPayload | undefined = ext.snapshotDraftFileSystem.parseSnapshotDraft(this.email);
        this.snapshotData = { ...snapshotDraft, snapshot_values: undefined } as Omit<CreateSnapshotPayload, 'snapshot_values'>;
        this.snapshotValues = snapshotDraft?.snapshot_values ?? [];

        const total: number = this.snapshotValues.reduce((cur, sv) => cur + sv.total, 0);
        return {
            id: this.id,
            label: l10n.t('Draft'),
            description: `$${total.toFixed(2)}`,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.Expanded,
            iconPath: new ThemeIcon("device-camera", "white"),
        };
    }

    getChildren(): PiExtTreeItem[] {
        return [
            new SnapshotByAccountsDraftItem(this, this.email, this.snapshotData, this.snapshotValues),
            new SnapshotDataDraftItem(this, this.email, this.snapshotData),
            new SnapshotValuesDraftItem(this, this.email, this.snapshotValues),
        ];
    }

    private getContextValues(): string {
        return createContextValue([SnapshotDraftItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(
            { ...this.snapshotData, snapshot_values: this.snapshotValues },
            undefined,
            4,
        );
    }
}