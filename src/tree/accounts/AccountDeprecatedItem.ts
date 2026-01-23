import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { createContextValue } from "../../utils/contextUtils";
import { viewPropertiesContext } from "../../constants";
import { AccountsItem } from "./AccountsItem";
import { Account } from "../../sdk/portfolio-instruments-api";
import { capitalize } from "../../utils/textUtils";

export class AccountDeprecatedItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'accountDeprecatedItem';
    static readonly regExp: RegExp = new RegExp(AccountDeprecatedItem.contextValue);

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
        this.contextValue = createContextValue([AccountDeprecatedItem.contextValue, viewPropertiesContext]);
    }

    getTreeItem(): TreeItem {
        return {
            id: this.id,
            label: this.label,
            description: `${capitalize(this.account.institution)}-${capitalize(this.account.tax_shelter)} ${l10n.t('(deprecated)')}`,
            contextValue: this.contextValue,
            iconPath: new ThemeIcon('home', 'white'),
        };
    }

    async viewProperties(): Promise<string> {
        return JSON.stringify(this.account, undefined, 4);
    }
}
