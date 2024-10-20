import { l10n } from "vscode";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { LoginContext } from "./LoginContext";
import { UserPasswordPromptStep } from "../UserPasswordPromptStep";
import { LoginUserExecuteStep } from "./LoginUserExecuteStep";
import { nonNullProp } from "../../../utils/nonNull";
import { ext } from "../../../extensionVariables";
import { EmailItem } from "../../../tree/auth/EmailItem";

export async function loginExisting(context: CommandContext, emailItem: EmailItem): Promise<void> {
    const wizardContext: LoginContext = {
        ...context,
        email: emailItem.email,
    };
    const wizard: Wizard<LoginContext> = new Wizard(wizardContext, {
        title: l10n.t('Sign in'),
        promptSteps: [
            new UserPasswordPromptStep(),
        ],
        executeSteps: [
            new LoginUserExecuteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Successfully logged into "{0}"', nonNullProp(wizardContext, 'email')));
    ext.portfolioInstrumentsTdp.refresh(emailItem);
}