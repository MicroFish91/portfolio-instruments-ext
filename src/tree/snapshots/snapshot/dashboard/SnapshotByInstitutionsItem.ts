import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../SnapshotItem";
import { getAuthToken } from "../../../../utils/tokenUtils";
import { nonNullValue } from "../../../../utils/nonNull";
import { createContextValue } from "../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../constants";
import { getSnapshotByAccount } from "../../../../sdk/snapshots/getSnapshotByAccount";
import { GenericItem } from "../../../GenericItem";
import { GetSnapshotAccountsResponse, ResourcesGrouped, Snapshot, SnapshotValue } from "../../../../sdk/portfolio-instruments-api";

export class SnapshotByInstitutionsItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotByInstitutionsItem';
    static readonly regExp: RegExp = new RegExp(SnapshotByInstitutionsItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
        readonly snapshotValues: SnapshotValue[],
    ) {
        super('Account Breakdown');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/accountBreakdown`;
    }

    private getContextValue(): string {
        return createContextValue([SnapshotByInstitutionsItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("graph-scatter", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const { fields: accountInstitutions, total: totals } = nonNullValue(await SnapshotByInstitutionsItem.getSnapshotByAccount(this.email, this.snapshotData.snap_id));
        return accountInstitutions.map((acc, i) => {
            const percent: number = Math.round(totals[i] / this.snapshotData.total * 100);
            return new GenericItem({
                id: `${this.id}/${i}`,
                label: acc,
                description: `${totals[i].toFixed(2)} (${percent}%)`,
                contextValue: 'snapshotAccountItem',
                iconPath: new ThemeIcon('home', 'white'),
            });
        });
    }

    static async getSnapshotByAccount(email: string, snapId: number): Promise<ResourcesGrouped | undefined> {
        const response: GetSnapshotAccountsResponse = await getSnapshotByAccount(nonNullValue(await getAuthToken(email)), snapId);
        return response.data?.accounts_grouped;
    }

    async viewProperties(): Promise<string> {
        const response = await SnapshotByInstitutionsItem.getSnapshotByAccount(this.email, this.snapshotData.snap_id);
        return JSON.stringify(response ?? {}, undefined, 4);
    }
}