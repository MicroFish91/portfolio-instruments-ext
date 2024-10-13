import { RegisterContext } from "./RegisterContext";
import { CommandContext } from "../registerCommand";
import { Wizard } from "../../wizard/Wizard";
import { RegisterUserExecuteStep } from "./RegisterUserExecuteStep";
import { UserEmailPromptStep } from "./UserEmailPromptStep";
import { UserPasswordPromptStep } from "./UserPasswordPromptStep";

export async function register(context: CommandContext) {
    const wizardContext: RegisterContext = context as RegisterContext;
    const wizard: Wizard<RegisterContext> = new Wizard(wizardContext, {
        title: "Register a new user",
        promptSteps: [
            new UserEmailPromptStep(),
            new UserPasswordPromptStep(),
        ],
        executeSteps: [
            new RegisterUserExecuteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(`Successfully registered new user: ${wizardContext.email}`);
}