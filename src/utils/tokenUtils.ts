import { SecretStorage } from "vscode";
import { ext } from "../extensionVariables";
import { tokenStorageKey } from "../constants";

export async function getAuthToken(email: string): Promise<string | undefined> {
    email = email.toLowerCase();

    const tokenRecord: Record<string, string> = await getAuthTokenRecord();
    return tokenRecord[email];
}

export async function storeAuthToken(email: string, token: string): Promise<void> {
    email = email.toLowerCase();

    const secrets: SecretStorage = ext.context.secrets;
    const tokenRecord: Record<string, string> = await getAuthTokenRecord();
    tokenRecord[email] = token;

    return await secrets.store(tokenStorageKey, JSON.stringify(tokenRecord));
}

export async function removeAuthToken(email: string): Promise<void> {
    email = email.toLowerCase();

    const tokenRecord: Record<string, string> = await getAuthTokenRecord();
    delete tokenRecord[email];

    const secrets: SecretStorage = ext.context.secrets;
    await secrets.store(tokenStorageKey, JSON.stringify(tokenRecord));
}

export async function hasAuthTokenRecord(): Promise<boolean> {
    return !!Object.keys((await getAuthTokenRecord())).length;
}

export async function getAuthTokenRecord(): Promise<Record<string, string>> {
    const secrets: SecretStorage = ext.context.secrets;
    const tokenStrings: string | undefined = await secrets.get(tokenStorageKey);
    return tokenStrings ? JSON.parse(tokenStrings) : {};
}

export async function removeAuthTokenRecord(): Promise<void> {
    const secrets: SecretStorage = ext.context.secrets;
    await secrets.delete(tokenStorageKey);
}