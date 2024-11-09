import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../../SnapshotItem";
import { MaturationDateResource, Snapshot, SnapshotValue } from "../../../../../sdk/types/snapshots";
import { getAuthToken } from "../../../../../utils/tokenUtils";
import { nonNullValue } from "../../../../../utils/nonNull";
import { createContextValue } from "../../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../../constants";
import { getSnapshotByMaturationDate, GetSnapshotByMaturationDateApiResponse, GetSnapshotMaturationDateOptions } from "../../../../../sdk/snapshots/getSnapshotByMaturationDate";
import { SnapshotMaturationStartItem } from "./SnapshotMaturationStartItem";
import { SnapshotMaturationEndItem } from "./SnapshotMaturationEndItem";
import { MaturationDateItem } from "./MaturationDateItem";
import { SnapshotMaturationFilterItem } from "./SnapshotMaturationFilterItem";

export class SnapshotByMaturationDateItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotByMaturationDateItem';
    static readonly regExp: RegExp = new RegExp(SnapshotByMaturationDateItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly snapshotValues: SnapshotValue[],
    ) {
        super('Maturation Date Breakdown');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/maturationDateBreakdown`;
    }

    private getContextValue(): string {
        return createContextValue([SnapshotByMaturationDateItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("graph-line", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const options: GetSnapshotMaturationDateOptions = {
            startDate: SnapshotMaturationStartItem.getMaturationStart(this.email, this.snapshotData.snap_id),
            endDate: SnapshotMaturationEndItem.getMaturationEnd(this.email, this.snapshotData.snap_id),
        };

        const resources: MaturationDateResource[] = await SnapshotByMaturationDateItem.getSnapshotByMaturationDate(this.email, this.snapshotData.snap_id, options) ?? [];
        return [
            new SnapshotMaturationFilterItem(this, this.email, this.snapshotData),
            ...resources.map(resource => new MaturationDateItem(this, this.email, this.snapshotData, resource)),
        ];
    }

    static async getSnapshotByMaturationDate(email: string, snapId: number, options?: GetSnapshotMaturationDateOptions): Promise<MaturationDateResource[] | undefined> {
        const response: GetSnapshotByMaturationDateApiResponse = await getSnapshotByMaturationDate(nonNullValue(await getAuthToken(email)), snapId, options);
        return response.data?.resources;
    }

    async viewProperties(): Promise<string> {
        const options: GetSnapshotMaturationDateOptions = {
            startDate: SnapshotMaturationStartItem.getMaturationStart(this.email, this.snapshotData.snap_id),
            endDate: SnapshotMaturationEndItem.getMaturationEnd(this.email, this.snapshotData.snap_id),
        };
        const response = await getSnapshotByMaturationDate(nonNullValue(await getAuthToken(this.email)), this.snapshotData.snap_id, options);
        return JSON.stringify(response.data ?? {}, undefined, 4);
    }
}