import { commands } from "vscode";
import { ext } from "../extensionVariables";
import { UserInterface } from "../wizard/UserInterface";

export interface CommandContext {
    ui: UserInterface;
    metadata: {
        commandId: string;
        start: number;
        end?: number;
    }
};

type CommandCallback = (context: CommandContext, ...args: unknown[]) => unknown;

export function registerCommand(commandId: string, callback: CommandCallback): void {
    ext.context.subscriptions.push(
        commands.registerCommand(commandId, wrapCallbackWithCommandContext(commandId, callback)),
    );
}

function wrapCallbackWithCommandContext(commandId: string, callback: CommandCallback) {
    return async (...args: unknown[]) => {
        const commandContext: CommandContext = {
            ui: new UserInterface(),
            metadata: {
                commandId,
                start: Date.now(),
            },
        };

        await callback(commandContext, ...args);
        commandContext.metadata.end = Date.now();
    };
}