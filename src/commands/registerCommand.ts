import { commands } from "vscode";
import { ext } from "../extensionVariables";

export interface CommandContext {
    commandId: string;
    metadata: {
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
    const commandContext: CommandContext = {
        commandId,
        metadata: {
            start: Date.now(),
        }
    };
    return (...args: unknown[]) => callback(commandContext, ...args);
}