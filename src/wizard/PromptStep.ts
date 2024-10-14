import { CommandContext } from "../commands/registerCommand";

export abstract class PromptStep<T extends CommandContext> {
    title?: string;

    abstract prompt(context: T);
    abstract shouldPrompt(context: T): boolean;
}