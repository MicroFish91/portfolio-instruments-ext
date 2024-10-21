import { l10n } from "vscode";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { LoginContext } from "./LoginContext";
import { UserPasswordStep } from "../UserPasswordStep";
import { LoginUserExecuteStep } from "./LoginUserExecuteStep";
import { nonNullProp } from "../../../utils/nonNull";
import { ext } from "../../../extensionVariables";
import { EmailItem } from "../../../tree/auth/EmailItem";

export async function refreshLogin(context: CommandContext, item: EmailItem): Promise<void> {
    const wizardContext: LoginContext = {
        ...context,
        email: item.email,
    };
    const wizard: Wizard<LoginContext> = new Wizard(wizardContext, {
        title: l10n.t('Sign in'),
        promptSteps: [
            new UserPasswordStep(),
        ],
        executeSteps: [
            new LoginUserExecuteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Successfully logged into "{0}"', nonNullProp(wizardContext, 'email')));
    ext.portfolioInstrumentsTdp.refresh(item);
}