import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { MaturationDateResource, Snapshot } from "../../../../../sdk/types/snapshots";
import { SnapshotByMaturationDateItem } from "./SnapshotByMaturationDateItem";
import { createContextValue } from "../../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../../constants";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export class MaturationDateItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'maturationDateItem';
    static readonly regExp: RegExp = new RegExp(MaturationDateItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotByMaturationDateItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly resource: MaturationDateResource,
    ) {
        super(resource.holding_name);
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/maturationDateBreakdown/${resource.holding_name}-${resource.account_name}`;
    }

    getTreeItem(): TreeItem {
        const maturationDate = new Date(this.resource.maturation_date);
        const timeFrom: string = dayjs(`${maturationDate.getFullYear()}-${maturationDate.getMonth() + 1}-${maturationDate.getDate()}`).fromNow();

        return {
            id: this.id,
            label: this.label,
            description: `${this.resource.maturation_date} (expiration ${timeFrom})`,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("note", "white"),
        };
    }

    private getContextValue(): string {
        return createContextValue([MaturationDateItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.resource, undefined, 4);
    }
}