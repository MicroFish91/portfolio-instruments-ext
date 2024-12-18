import { CommandContext } from "../../registerCommand";
import { Wizard } from "../../../wizard/Wizard";
import { RegisterUserExecuteStep } from "./RegisterUserExecuteStep";
import { l10n } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { UserEmailStep } from "../UserEmailStep";
import { UserPasswordStep } from "../UserPasswordStep";
import { RegisterContext } from "./RegisterContext";

export async function register(context: CommandContext): Promise<void> {
    const wizardContext: RegisterContext = context as RegisterContext;
    const wizard: Wizard<RegisterContext> = new Wizard(wizardContext, {
        title: l10n.t("Register a new user"),
        promptSteps: [
            new UserEmailStep(),
            new UserPasswordStep(),
        ],
        executeSteps: [
            new RegisterUserExecuteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Successfully created user "{0}"', nonNullProp(wizardContext, 'email')));
}