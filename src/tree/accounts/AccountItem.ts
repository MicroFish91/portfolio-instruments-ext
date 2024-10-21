import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Account } from "../../sdk/types/accounts";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { capitalize } from "../../utils/textUtils";
import { AccountsItem } from "./AccountsItem";

export class AccountItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountItem';
    static readonly regExp: RegExp = new RegExp(AccountItem.contextValue);

    id: string;

    constructor(
        readonly parent: AccountsItem,
        readonly email: string,
        readonly account: Account,
    ) {
        super(account.name);
        this.id = `/emails/${email}/accounts/${account.account_id}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `${capitalize(this.account.institution)}-${capitalize(this.account.tax_shelter)}`,
            contextValue: this.getContextValue(),
            iconPath: new ThemeIcon('home', 'white'),
        };
    }

    private getContextValue(): string {
        return createContextValue([AccountItem.contextValue, viewPropertiesContext]);
    }

    async viewProperties(): Promise<string> {
        return JSON.stringify(this.account, undefined, 4);
    }
}