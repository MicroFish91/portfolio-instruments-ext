import { l10n } from "vscode";
import { ApiEndpointSetContext } from "./ApiEndpointSetContext";
import { PromptStep } from "../../wizard/PromptStep";

export class ApiEndpointPromptStep<T extends ApiEndpointSetContext> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.newApiEndpoint = await context.ui.showInputBox({
            title: this.title,
            value: 'http://localhost:3000',
            prompt: l10n.t('Enter the API endpoint base URL'),
            // Todo: Could add validation, but don't care much about it to be honest
        });
    }

    shouldPrompt(context: T): boolean {
        return !context.newApiEndpoint;
    }
}