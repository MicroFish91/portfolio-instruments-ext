import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { CreateSnapshotValuePayload } from "../../../sdk/snapshots/createSnapshot";
import { createContextValue } from "../../../utils/contextUtils";
import { viewPropertiesContext } from "../../../constants";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { Account } from "../../../sdk/types/accounts";
import { Holding } from "../../../sdk/types/holdings";
import { capitalize } from "../../../utils/textUtils";

export class SnapshotValueDraftItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotValueDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotValueDraftItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotDraftItem,
        readonly email: string,

        readonly svIdx: number,
        readonly snapshotValue: CreateSnapshotValuePayload,
        readonly account: Account,
        readonly holding: Holding,
    ) {
        super(holding.name);
        this.id = `/emails/${email}/snapshots/draft/snapshotValues/${svIdx}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: `${capitalize(this.holding.name)} ($${this.snapshotValue.total})`,
            description: `${capitalize(this.account.institution)}-${capitalize(this.account.tax_shelter)}`,
            contextValue: this.getContextValues(),
            collapsibleState: TreeItemCollapsibleState.None,
            iconPath: new ThemeIcon("variable", "white"),
        };
    }

    private getContextValues(): string {
        return createContextValue([SnapshotValueDraftItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.snapshotValue, undefined, 4);
    }
}