import { CommandContext } from "../commands/registerCommand";

export abstract class PromptStep<T extends CommandContext> {
    abstract prompt(context: T);
    abstract shouldPrompt(context: T): boolean;
}