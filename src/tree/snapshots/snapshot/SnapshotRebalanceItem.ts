import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotItem } from "./SnapshotItem";
import { Snapshot } from "../../../sdk/types/snapshots";
import { getSnapshotRebalance, GetSnapshotRebalanceApiResponse } from "../../../sdk/snapshots/getSnapshotRebalance";
import { getAuthToken } from "../../../utils/tokenUtils";
import { nonNullValue } from "../../../utils/nonNull";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { GenericItem } from "../../GenericItem";
import { EmailItem } from "../../auth/EmailItem";

export class SnapshotRebalanceItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotRebalanceItem';
    static readonly regExp: RegExp = new RegExp(SnapshotRebalanceItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,
        readonly snapshotData: Snapshot,
    ) {
        super('Rebalance Calculations');
        this.id = `/snapshots/${snapshotData.snap_id}/dashboard/rebalance`;
    }

    private getContextValue(): string {
        return createContextValue([SnapshotRebalanceItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.getContextValue(),
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("diff-multiple", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const { settings } = await EmailItem.getUserAndSettingsWithCache(this.email);

        const response: GetSnapshotRebalanceApiResponse = await getSnapshotRebalance(
            nonNullValue(await getAuthToken(this.email)),
            this.snapshotData.snap_id,
        );
        if (response.error) {
            return [];
        }

        const rebalanceItems: GenericItem[] = response.data?.change_required.map(alloc => {
            const changeRequired: string = alloc.value > 0 ? `+${alloc.value.toFixed(2)}` : `${alloc.value.toFixed(2)}`;
            return new GenericItem({
                id: `${this.id}/${alloc.category}`,
                label: alloc.category,
                description: changeRequired,
                contextValue: 'snapshotRebalanceItem',
                collapsibleState: TreeItemCollapsibleState.None,
                iconPath: new ThemeIcon('request-changes', 'white'),
            });
        }) ?? [];

        return [
            ...rebalanceItems,
            new GenericItem({
                id: `${this.id}/total`,
                label: `$${String(response.data?.snapshot_total_omit_skips.toFixed(2))}`,
                description: l10n.t('Total'),
                contextValue: 'rebalanceTotalItem',
                collapsibleState: TreeItemCollapsibleState.None,
                iconPath: new ThemeIcon('diff-multiple', 'white'),
            }),
            new GenericItem({
                id: `${this.id}/currentThreshold`,
                label: `${String(response.data?.rebalance_thresh_pct)}%`,
                description: l10n.t('Max Deviation') +
                    (
                        (response.data?.rebalance_thresh_pct ?? 0) > settings.reb_thresh_pct ?
                            ' ' + l10n.t('(exceeds rebalance threshold)') :
                            ''
                    ),
                contextValue: 'currentThresholdItem',
                collapsibleState: TreeItemCollapsibleState.None,
                iconPath: (response.data?.rebalance_thresh_pct ?? 0) > settings.reb_thresh_pct ?
                    new ThemeIcon('warning', 'white') :
                    new ThemeIcon('pass', 'white')
            }),
        ];
    }

    async viewProperties(): Promise<string> {
        const response: GetSnapshotRebalanceApiResponse = await getSnapshotRebalance(
            nonNullValue(await getAuthToken(this.email)),
            this.snapshotData.snap_id,
        );
        return JSON.stringify(response.data ?? {}, undefined, 4);
    }
}