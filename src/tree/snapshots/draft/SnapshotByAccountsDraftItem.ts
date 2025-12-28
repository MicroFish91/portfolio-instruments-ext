import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { PiExtTreeItem } from "../../PiExtTreeDataProvider";
import { SnapshotDraftItem } from "./SnapshotDraftItem";
import { ext } from "../../../extensionVariables";
import { AccountsItem } from "../../accounts/AccountsItem";
import { GenericItem } from "../../GenericItem";
import { nonNullValue } from "../../../utils/nonNull";
import { capitalize } from "../../../utils/textUtils";
import { Account, CreateSnapshotPayload, CreateSnapshotValuePayload } from "../../../sdk/portfolio-instruments-api";

export class SnapshotByAccountsDraftItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'snapshotByAccountsDraftItem';
    static readonly regExp: RegExp = new RegExp(SnapshotByAccountsDraftItem.contextValue);

    id: string;

    constructor(
        readonly parent: SnapshotDraftItem,
        readonly email: string,
        readonly snapshotData: Omit<CreateSnapshotPayload, 'snapshot_values'>,
        readonly snapshotValues: CreateSnapshotValuePayload[],
    ) {
        super('Account Breakdown');
        this.id = `/users/${this.email}/snapshots/draft/accountsBreakdown`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            contextValue: SnapshotByAccountsDraftItem.contextValue,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            iconPath: new ThemeIcon("graph-scatter", "white"),
        };
    }

    async getChildren(): Promise<PiExtTreeItem[]> {
        const accounts: Account[] = await AccountsItem.getAccountsWithCache(this.email);
        const accountsMap: Map<number, Account> = new Map();

        for (const account of accounts) {
            accountsMap.set(account.account_id, account);
        }

        const snapshotValues: CreateSnapshotValuePayload[] = ext.snapshotDraftFileSystem.parseSnapshotDraft(this.email)?.snapshot_values ?? [];
        const accountBreakdown: Record<string, number> = {};

        for (const sv of snapshotValues) {
            const accountName: string | undefined = accountsMap.get(sv.account_id)?.name;
            if (!accountName) {
                continue;
            }

            let total: number = accountBreakdown[sv.account_id] ?? 0;
            total += sv.total;
            accountBreakdown[sv.account_id] = total;
        }

        const items: PiExtTreeItem[] = [];
        for (const [accountId, total] of Object.entries(accountBreakdown)) {
            const account: Account = nonNullValue(accountsMap.get(Number(accountId)));
            items.push(new GenericItem({
                id: `${this.id}/${account.name}`,
                label: account.name,
                description: `$${total.toFixed(2)} (${account.institution}:${capitalize(account.tax_shelter)})`,
                contextValue: 'snapshotByInstitutionsDraftItem',
                iconPath: new ThemeIcon('home', 'white'),
            }));
        }
        return items;
    }
}