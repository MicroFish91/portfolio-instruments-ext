import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { createContextValue } from "../../../utils/contextUtils";
import { reorderableContext, viewPropertiesContext } from "../../../constants";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { capitalize } from "../../../utils/textUtils";
import { Reorderable } from "../../reorder";
import { SnapshotValuesDraftItem } from "./SnapshotValuesDraftItem";
import { Account, CreateSnapshotValuePayload, Holding } from "../../../sdk/portfolio-instruments-api";

export class SnapshotValueDraftItem extends TreeItem implements PiExtTreeItem, Reorderable {
    static readonly contextValue: string = 'snapshotValueDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValueDraftItem.contextValue);

    id: string;
    kind = 'snapshotValueDraft';

    constructor(
        readonly grandParent: SnapshotDraftItem,
        readonly parent: SnapshotValuesDraftItem,
        readonly email: string,

        readonly svIdx: number,
        readonly snapshotValue: CreateSnapshotValuePayload,
        readonly account: Account,
        readonly holding: Holding,
    ) {
        super(holding.name);
        this.id = `/users/${email}/snapshots/draft/snapshotValues/${svIdx}`;
        this.contextValue = createContextValue([SnapshotValueDraftItem.contextValue, reorderableContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: `${this.holding.name} (${this.holding.asset_category})`,
            description: `${this.account.name} ${this.account.institution}:${capitalize(this.account.tax_shelter)} $${this.snapshotValue.total.toFixed(2)} `,
            contextValue: this.contextValue,
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValue, undefined, 4);
    }

    getResourceId(): string {
        // Since draft items don't have real resource IDs assigned yet, just use the index
        return String(this.svIdx);
    }
}