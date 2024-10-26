import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { CreateSnapshotPayload } from "../../../sdk/snapshots/createSnapshot";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { GenericItem, GenericItemOptions } from "../../GenericItem";

const payloadKeys: string[] = ['snap_date', 'description', 'benchmark_id'];

export class SnapshotPayloadItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotPayloadItem';
    static readonly regExp: RegExp = new RegExp(SnapshotPayloadItem.contextValue);

    id: string;

    constructor(
        readonly draftItem: SnapshotDraftItem,
        readonly email: string,
        readonly snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
    ) {
        super('Snapshot');
        this.id = `/emails/${email}/snapshots/draft/snapshotPayload`;
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

    getChildren(): PiExtTreeItem[] {
        const keys: string[] = Object.keys(this.snapshotData);
        for (const key of payloadKeys) {
            if (keys.includes(key)) {
                continue;
            }
            this.snapshotData[key] = undefined;
        }

        const items: PiExtTreeItem[] = [];
        for (const [key, value] of Object.entries(this.snapshotData)) {
            if (key === 'snapshot_values') {
                continue;
            }

            const options: GenericItemOptions = {
                id: `/emails/${this.email}/draft/snapshotPayload/${key}`,
                label: `${key}=${value ?? ''}`,
                contextValue: 'sPayloadItem',
                collapsibleState: TreeItemCollapsibleState.None,
                iconPath: new ThemeIcon('dash', 'white'),
            };
            items.push(new GenericItem(options));
        }
        return items;
    }

    private getContextValues(): string {
        return createContextValue([SnapshotPayloadItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotData, undefined, 4);
    }
}