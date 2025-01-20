import { l10n, ThemeIcon, TreeItem } from "vscode";
import { PiExtTreeItem } from "../PiExtTreeDataProvider";
import { settingUtils } from "../../utils/settingUtils";

const setApiEndpoint: string = l10n.t('API endpoint');

export class ApiEndpointItem extends TreeItem implements PiExtTreeItem {
    static readonly contextValue: string = 'apiEndpointItem';
    static readonly regExp: RegExp = new RegExp(ApiEndpointItem.contextValue);

    constructor() {
        super(setApiEndpoint);
    }

    getTreeItem(): TreeItem {
        return {
            id: '/apiEndpoint',
            label: this.label,
            description: settingUtils.getApiEndpointBaseUrl(),
            contextValue: ApiEndpointItem.contextValue,
            iconPath: new ThemeIcon('location', 'white'),
            command: {
                title: setApiEndpoint,
                command: 'portfolioInstruments.setApiEndpoint',
                tooltip: l10n.t('Set API Endpoint'),
            }
        };
    }
}