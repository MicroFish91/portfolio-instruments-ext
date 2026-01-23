import { ConfigurationTarget, workspace, WorkspaceConfiguration } from "vscode";
import { nonNullValue } from "./nonNull";

export namespace settingUtils {
    const extPrefix: string = 'portfolioInstruments';
    const apiEndpointSetting: string = 'apiEndpoint';
    const showDeprecatedResourcesSetting: string = 'showDeprecatedResources';

    /**
     * Directly retrieves one of the user's `Global` configuration settings.
     * @param key The key of the setting to retrieve
     */
    export function getGlobalSetting<T>(key: string): T | undefined {
        const projectConfiguration: WorkspaceConfiguration = workspace.getConfiguration(extPrefix);
        const result: { globalValue?: T, defaultValue?: T } | undefined = projectConfiguration.inspect<T>(key);
        return result?.globalValue === undefined ? result?.defaultValue : result?.globalValue;
    }

    /**
     * Directly updates one of the user's `Global` configuration settings.
     * @param key The key of the setting to update
     * @param value The value of the setting to update
     */
    export async function updateGlobalSetting<T = string>(key: string, value: T): Promise<void> {
        const projectConfiguration: WorkspaceConfiguration = workspace.getConfiguration(extPrefix);
        await projectConfiguration.update(key, value, ConfigurationTarget.Global);
    }

    export function getApiEndpointBaseUrl(): string {
        return nonNullValue(getGlobalSetting(apiEndpointSetting), 'Could not determine a valid api endpoint from user settings.');
    }

    export async function updateApiEndpointBaseUrl(newBaseUrl: string): Promise<void> {
        await updateGlobalSetting(apiEndpointSetting, newBaseUrl);
    }

    export function getShowDeprecatedResources(): boolean {
        return getGlobalSetting<boolean>(showDeprecatedResourcesSetting) ?? false;
    }

    export async function updateShowDeprecatedResources(show: boolean): Promise<void> {
        await updateGlobalSetting(showDeprecatedResourcesSetting, show);
    }
}