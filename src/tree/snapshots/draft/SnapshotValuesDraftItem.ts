import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { reordererContext, viewPropertiesContext } from "../../../constants";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { SnapshotValueDraftItem } from "./SnapshotValueDraftItem";
import { AccountsItem } from "../../accounts/AccountsItem";
import { HoldingsItem } from "../../holdings/HoldingsItem";
import { nonNullValue } from "../../../utils/nonNull";
import { GenericPiResourceModel, orderResourcesByTargetIds, Reorderer } from "../../reorder";
import { ext } from "../../../extensionVariables";
import { Account, CreateSnapshotValuePayload, Holding } from "../../../sdk/portfolio-instruments-api";

export class SnapshotValuesDraftItem extends TreeItem implements PiExtTreeItem, Reorderer {
    static readonly contextValue: string = 'snapshotValuesDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValuesDraftItem.contextValue);

    id: string;
    kind: 'snapshotValuesDraft';

    constructor(
        readonly parent: SnapshotDraftItem,
        readonly email: string,

        readonly snapshotValues: CreateSnapshotValuePayload[],
    ) {
        super('Values');
        this.id = `/users/${email}/snapshots/draft/snapshotValues`;
        this.contextValue = createContextValue([SnapshotValuesDraftItem.contextValue, reordererContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: this.contextValue,
            collapsibleState: TreeItemCollapsibleState.Expanded,
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

        return this.snapshotValues.map((sv, i) => new SnapshotValueDraftItem(
            this.parent,
            this,
            this.email,
            i,
            sv,
            nonNullValue(accountsMap.get(sv.account_id)),
            nonNullValue(holdingsMap.get(sv.holding_id)),
        ));
    }

    canReorderItem(item: PiExtTreeItem): boolean {
        return !!item.contextValue?.includes(SnapshotValueDraftItem.contextValue);
    }

    async getOrderedResourceModels(): Promise<(CreateSnapshotValuePayload & GenericPiResourceModel)[]> {
        // There are no resource model ids because draft items represent resources that haven't been created yet...
        // so just use the current index of the value as the ID
        // (Also, there's no need to manage any reordering here because we always reorder the source draft directly)
        return this.snapshotValues.map((sv, idx) => {
            return {
                ...sv,
                id: String(idx),
            };
        });
    }

    async reorderChildrenByTargetResourceModelIds(ids: string[]): Promise<void> {
        const snapshotValues: (CreateSnapshotValuePayload & GenericPiResourceModel)[] = await this.getOrderedResourceModels();
        // Remove the generic resource id we added as it's not required by the actual API
        const reorderedValues: CreateSnapshotValuePayload[] = orderResourcesByTargetIds(snapshotValues, ids)
            .map(sv => {
                delete (sv as { id?: string }).id;
                return sv;
            });

        await ext.snapshotDraftFileSystem.updateSnapshotValuesDraft(this.parent, reorderedValues);
        ext.portfolioInstrumentsTdp.refresh(this.parent);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValues, undefined, 4);
    }
}