import { CommandContext } from "../commands/registerCommand";
import { ExecuteStep } from "./ExecuteStep";

export type WizardSteps<T extends CommandContext> = { promptSteps?: PromptStep<T>[]; executeSteps?: ExecuteStep<T>[] } | undefined;

export abstract class PromptStep<T extends CommandContext> {
    title?: string;

    abstract prompt(context: T);
    abstract shouldPrompt(context: T): boolean;
    subWizard?(context: T): WizardSteps<T> | Promise<WizardSteps<T>>;
}