import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Account } from "../../sdk/types/accounts";
import { createContextValue } from "../../utils/contextUtils";
import { reorderableContext, viewPropertiesContext } from "../../constants";
import { capitalize } from "../../utils/textUtils";
import { AccountsItem } from "./AccountsItem";
import { Reorderable } from "../reorder";

export class AccountItem extends TreeItem implements PiExtTreeItem, Reorderable {
    static readonly contextValue: string = 'accountItem';
    static readonly regExp: RegExp = new RegExp(AccountItem.contextValue);

    id: string;
    kind = 'account';
    contextValue: string;

    constructor(
        readonly parent: AccountsItem,
        readonly email: string,
        readonly account: Account,
    ) {
        super(account.name);
        this.id = `/users/${email}/accounts/${account.account_id}`;
        this.contextValue = createContextValue([AccountItem.contextValue, reorderableContext, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `${capitalize(this.account.institution)}-${capitalize(this.account.tax_shelter)}`,
            contextValue: this.contextValue,
            iconPath: new ThemeIcon('home', 'white'),
        };
    }

    async viewProperties(): Promise<string> {
        return JSON.stringify(this.account, undefined, 4);
    }

    getResourceId(): string {
        return this.account.account_id.toString();
    }
}