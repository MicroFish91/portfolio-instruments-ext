import { ProgressLocation, ProgressOptions, window } from "vscode";
import { CommandContext } from "../commands/registerCommand";
import { ExecuteStep } from "./ExecuteStep";
import { PromptStep } from "./PromptStep";

export type WizardOptions<T extends CommandContext> = {
    title: string;
    promptSteps: PromptStep<T>[] | undefined;
    executeSteps: ExecuteStep<T>[] | undefined;
};

export class Wizard<T extends CommandContext> {
    private context: T;
    private title: string;
    private promptSteps: PromptStep<T>[];
    private executeSteps: ExecuteStep<T>[];

    constructor(context: T, options: WizardOptions<T>) {
        this.context = context;
        this.title = options.title;
        this.promptSteps = options.promptSteps ?? [];
        this.executeSteps = options.executeSteps ?? [];
    }

    async prompt(): Promise<void> {
        for (const s of this.promptSteps) {
            if (!s.shouldPrompt(this.context)) {
                continue;
            }
            await s.prompt(this.context);
        }
    }

    async execute(): Promise<void> {
        const progressOptions: ProgressOptions = {
            title: this.title,
            location: ProgressLocation.Notification,
            cancellable: false,
        };

        await window.withProgress(progressOptions, async (progress) => {
            this.executeSteps = this.executeSteps.sort((a, b) => a.priority - b.priority);

            for (const s of this.executeSteps) {
                if (!s.shouldExecute(this.context)) {
                    continue;
                }
                await s.execute(this.context, progress);
            }
        });
    }
}