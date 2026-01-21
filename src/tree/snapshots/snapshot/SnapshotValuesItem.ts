import { l10n, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { reordererContext, viewPropertiesContext } from "../../../constants";
import { SnapshotItem } from "./SnapshotItem";
import { AccountsItem } from "../../accounts/AccountsItem";
import { HoldingsItem } from "../../holdings/HoldingsItem";
import { SnapshotValueItem } from "./SnapshotValueItem";
import { nonNullValue } from "../../../utils/nonNull";
import { convertToGenericPiResourceModel, GenericPiResourceModel, orderResourcesByTargetIds, Reorderer } from "../../reorder";
import { ext } from "../../../extensionVariables";
import { Account, Holding, Snapshot, SnapshotValue } from "../../../sdk/portfolio-instruments-api";
import { updateSnapshotValueOrder } from "../../../sdk/snapshots/updateSnapshotValueOrder";
import { getSnapshot } from "../../../sdk/snapshots/getSnapshot";
import { getAuthToken } from "../../../utils/tokenUtils";

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

        // Get ordered snapshotValues from server-side value_order
        const orderedSnapshotValues: SnapshotValue[] = this.getOrderedSnapshotValues();
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

    /**
     * Gets snapshot values ordered by server-side value_order.
     * 
     * Uses GenericPiResourceModel abstraction because different resources have different ID fields:
     * - SnapshotValue uses 'snap_val_id'
     * - Account uses 'account_id'
     * - Holding uses 'holding_id'
     * 
     * By converting to a common { id: string } format, we can use the same orderResourcesByTargetIds()
     * function for all resource types instead of writing separate ordering logic for each.
     */
    private getOrderedSnapshotValues(): SnapshotValue[] {
        // Convert all snapshot values to GenericPiResourceModel (adds common 'id' field)
        const snapshotValueResourceModels: (SnapshotValue & GenericPiResourceModel)[] = 
            this.snapshotValues.map(sv => convertToGenericPiResourceModel(sv, 'snap_val_id'));

        // If server has value_order set, use it to order the resources
        if (this.snapshot.value_order && this.snapshot.value_order.length > 0) {
            const orderedResourceIds = this.snapshot.value_order.map(id => String(id));
            return orderResourcesByTargetIds(snapshotValueResourceModels, orderedResourceIds);
        }
        
        // Fallback: return snapshot values in their default order
        return this.snapshotValues;
    }

    /**
     * Required by Reorderer interface. Returns ordered snapshot values with GenericPiResourceModel structure.
     * The drag-drop controller uses this to understand the current order before computing the new order.
     */
    async getOrderedResourceModels(): Promise<(SnapshotValue & GenericPiResourceModel)[]> {
        return this.getOrderedSnapshotValues().map(sv => 
            convertToGenericPiResourceModel(sv, 'snap_val_id')
        );
    }

    /**
     * Updates the snapshot value order on the server and refreshes the tree view.
     * Replaces client-side globalState caching with server-side persistence.
     */
    async reorderChildrenByTargetResourceModelIds(ids: string[]): Promise<void> {
        const token = await getAuthToken(this.email);
        if (!token) {
            throw new Error('No authentication token available');
        }

        // Convert string IDs back to numbers for the API
        const valueOrder = ids.map(id => parseInt(id, 10));
        
        // Update order on server
        await updateSnapshotValueOrder(token, this.snapshot.snap_id, { value_order: valueOrder });
        
        // Refetch snapshot to get updated value_order from server
        const updatedSnapshotResponse = await getSnapshot(token, this.snapshot.snap_id);
        if (updatedSnapshotResponse.data?.snapshot) {
            // Update the local snapshot reference with server data
            Object.assign(this.snapshot, updatedSnapshotResponse.data.snapshot);
        }
        
        // Refresh tree view to display new order
        ext.portfolioInstrumentsTdp.refresh(this);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValues, undefined, 4);
    }
}