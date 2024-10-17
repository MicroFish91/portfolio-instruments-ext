import { ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { Account } from "../../sdk/types/accounts";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { capitalize } from "../../utils/textUtils";

export class AccountItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountItem';
    static readonly regExp: RegExp = new RegExp(AccountItem.contextValue);

    id: string;

    constructor(readonly email: string, readonly account: Account) {
        super(account.name);
        this.id = `/email/${this.email}/accounts/${this.account.name}`;
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `${capitalize(this.account.institution)}-${capitalize(this.account.tax_shelter)}`,
            contextValue: this.getContextValue(),
            iconPath: new ThemeIcon("dash", "white"),
        };
    }

    private getContextValue(): string {
        return createContextValue([AccountItem.contextValue, viewPropertiesContext]);
    }

    viewProperties(): string {
        return JSON.stringify(this.account, undefined, 4);
    }
}