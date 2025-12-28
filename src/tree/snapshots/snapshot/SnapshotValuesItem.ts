import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { orderKeyPrefix, reordererContext, viewPropertiesContext } from "../../../constants";
import { SnapshotItem } from "./SnapshotItem";
import { AccountsItem } from "../../accounts/AccountsItem";
import { HoldingsItem } from "../../holdings/HoldingsItem";
import { SnapshotValueItem } from "./SnapshotValueItem";
import { nonNullValue } from "../../../utils/nonNull";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds, Reorderer } from "../../reorder";
import { ext } from "../../../extensionVariables";
import { Account, Holding, Snapshot, SnapshotValue } from "../../../sdk/portfolio-instruments-api";

export class SnapshotValuesItem extends TreeItem implements PiExtTreeItem, Reorderer {
    static readonly contextValue: string = 'snapshotValuesItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValuesItem.contextValue);

    id: string;
    kind = 'snapshotValues';

    constructor(
        readonly parent: SnapshotItem,
        readonly email: string,

        readonly snapshot: Snapshot,
        private snapshotValues: SnapshotValue[],
    ) {
        super(l10n.t('Values'));
        this.id = `/snapshots/${snapshot.snap_id}/snapshotValues`;
        this.contextValue = createContextValue([SnapshotValuesItem.contextValue, reordererContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("array", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const accounts: Account[] = await AccountsItem.getAccountsWithCache(this.email);
        const accountsMap = new Map<number, Account>();

        for (const account of accounts) {
            accountsMap.set(account.account_id, account);
        }

        const holdings: Holding[] = await HoldingsItem.getHoldingsWithCache(this.email);
        const holdingsMap = new Map<number, Holding>();

        for (const holding of holdings) {
            holdingsMap.set(holding.holding_id, holding);
        }

        // Get ordered snapshotValues
        const orderedSnapshotValues: SnapshotValue[] = await this.getOrderedResourceModels();
        return orderedSnapshotValues.map(sv => new SnapshotValueItem(
            this.parent,
            this,
            this.email,
            nonNullValue(accountsMap.get(sv.account_id)),
            nonNullValue(holdingsMap.get(sv.holding_id)),
            this.snapshot,
            sv,
        ));
    }

    canReorderItem(item: PiExtTreeItem): boolean {
        return !!item.contextValue?.includes(SnapshotValueItem.contextValue);
    }

    async getOrderedResourceModels(): Promise<(SnapshotValue & GenericPiResourceModel)[]> {
        const snapshotValueResourceModels: (SnapshotValue & GenericPiResourceModel)[] = this.snapshotValues.map(sv => convertToGenericPiResourceModel(sv, 'snap_val_id'));
        const orderedResourceIds: string[] = ext.context.globalState.get<string[]>(SnapshotValuesItem.generatePiExtSnapshotValuesOrderId(this.email, this.snapshot.snap_id)) ?? [];
        return orderResourcesByTargetIds(snapshotValueResourceModels, orderedResourceIds);
    }

    async reorderChildrenByTargetResourceModelIds(ids: string[]): Promise<void> {
        await ext.context.globalState.update(SnapshotValuesItem.generatePiExtSnapshotValuesOrderId(this.email, this.snapshot.snap_id), ids);
        ext.portfolioInstrumentsTdp.refresh(this);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValues, undefined, 4);
    }

    static generatePiExtSnapshotValuesOrderId(email: string, snapshotId: string | number): string {
        return orderKeyPrefix + `/users/${email}/snapshots/${snapshotId}/snapshotValues`;
    }
}