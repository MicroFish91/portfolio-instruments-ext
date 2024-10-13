import { Progress } from "vscode";
import { CommandContext } from "../commands/registerCommand";

export abstract class ExecuteStep<T extends CommandContext> {
    abstract priority: number;
    abstract execute(context: T, progress: Progress<{ message?: string; increment?: number }>);
    abstract shouldExecute(context: T): boolean;
}