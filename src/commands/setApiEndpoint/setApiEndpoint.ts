import { l10n } from "vscode";
import { ApiEndpointSetContext } from "./ApiEndpointSetContext";
import { ApiEndpointPromptStep } from "./ApiEndpointPromptStep";
import { ApiEndpointSetStep } from "./ApiEndpointSetStep";
import { CommandContext } from "../registerCommand";
import { Wizard } from "../../wizard/Wizard";
import { ext } from "../../extensionVariables";

export async function setApiEndpoint(context: CommandContext): Promise<void> {
    const wizard: Wizard<ApiEndpointSetContext> = new Wizard(context, {
        title: l10n.t('Set API Endpoint'),
        promptSteps: [
            new ApiEndpointPromptStep(),
        ],
        executeSteps: [
            new ApiEndpointSetStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Updated target API endpoint.'));
    ext.portfolioInstrumentsTdp.refresh();
}