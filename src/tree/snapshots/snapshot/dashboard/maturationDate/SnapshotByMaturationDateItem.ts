import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../../../PiExtTreeDataProvider";
import { SnapshotItem } from "../../SnapshotItem";
import { getAuthToken } from "../../../../../utils/tokenUtils";
import { nonNullValue } from "../../../../../utils/nonNull";
import { createContextValue } from "../../../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../../../constants";
import { getSnapshotByMaturationDate, GetSnapshotMaturationDateOptions } from "../../../../../sdk/snapshots/getSnapshotByMaturationDate";
import { SnapshotMaturationStartItem } from "./SnapshotMaturationStartItem";
import { SnapshotMaturationEndItem } from "./SnapshotMaturationEndItem";
import { MaturationDateItem } from "./MaturationDateItem";
import { SnapshotMaturationFilterItem } from "./SnapshotMaturationFilterItem";
import { GenericItem } from "../../../../GenericItem";
import { GetSnapshotMaturationDateResponse, MaturationDateResource, Snapshot, SnapshotValue } from "../../../../../sdk/portfolio-instruments-api";

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
        const { durationYrs, interestRatePct } = this.computeWeightedAverageDurationAndInterestRate(resources);

        return [
            new SnapshotMaturationFilterItem(this, this.email, this.snapshotData),
            ...resources
                .sort((a, b) => new Date(b.maturation_date).getTime() - new Date(a.maturation_date).getTime())
                .map((resource, idx) => new MaturationDateItem(this, this.email, this.snapshotData, idx, resource)),
            new GenericItem({
                id: `${this.id}/averageRate`,
                label: interestRatePct + '%',
                description: 'Average Weighted Rate',
                contextValue: 'averageRateItem',
                collapsibleState: TreeItemCollapsibleState.None,
                iconPath: new ThemeIcon("graph-line", "white"),
            }),
            new GenericItem({
                id: `${this.id}/averageDuration`,
                label: durationYrs.toString() + ' Years',
                description: 'Average Weighted Duration',
                contextValue: 'averageDurationItem',
                collapsibleState: TreeItemCollapsibleState.None,
                iconPath: new ThemeIcon("graph-line", "white"),
            }),
        ];
    }

    private computeWeightedAverageDurationAndInterestRate(resources: MaturationDateResource[]): { durationYrs: number; interestRatePct: number } {
        const total: number = resources.reduce((sum, resource) => sum + resource.total, 0);

        const weightedDurationsYrs: number[] = [];
        const weightedInterestRatePcts: number[] = [];

        for (const r of resources) {
            const weight: number = r.total / total;

            const weightedInterestRatePct: number = weight * r.interest_rate_pct;
            weightedInterestRatePcts.push(weightedInterestRatePct);

            const durationYears: number = this.calculateDurationInYears(r.maturation_date);
            const weightedDuration: number = weight * durationYears;
            weightedDurationsYrs.push(weightedDuration);
        }

        const weightedDuration: number = weightedDurationsYrs.reduce((sum, wd) => sum + wd, 0);
        const weightedInterestRates: number = weightedInterestRatePcts.reduce((sum, wir) => sum + wir, 0);

        return {
            durationYrs: Math.round(weightedDuration * 100) / 100,
            interestRatePct: Math.round(weightedInterestRates * 100) / 100,
        };
    }

    private calculateDurationInYears(maturationDate: string): number {
        const currentDate = new Date();
        const matDate = new Date(maturationDate);
        const timeDifferenceMs = matDate.getTime() - currentDate.getTime();
        const durationYears = timeDifferenceMs / (1000 * 60 * 60 * 24 * 365.25); // 365.25 accounts for leap years
        return Math.max(0, durationYears); // Ensure non-negative duration
    }

    static async getSnapshotByMaturationDate(email: string, snapId: number, options?: GetSnapshotMaturationDateOptions): Promise<MaturationDateResource[] | undefined> {
        const response: GetSnapshotMaturationDateResponse = await getSnapshotByMaturationDate(nonNullValue(await getAuthToken(email)), snapId, options);
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