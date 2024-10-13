import { l10n } from "vscode";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { LoginContext } from "./LoginContext";
import { UserEmailPromptStep } from "../UserEmailPromptStep";
import { UserPasswordPromptStep } from "../UserPasswordPromptStep";
import { LoginUserExecuteStep } from "./LoginUserExecuteStep";
import { nonNullProp } from "../../../utils/nonNull";

export async function login(context: CommandContext): Promise<void> {
    const wizardContext: LoginContext = context as LoginContext;
    const wizard: Wizard<LoginContext> = new Wizard(wizardContext, {
        title: l10n.t('Sign in'),
        promptSteps: [
            new UserEmailPromptStep(),
            new UserPasswordPromptStep(),
        ],
        executeSteps: [
            new LoginUserExecuteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Successfully logged in user: "{0}"', nonNullProp(wizardContext, 'email')));
}