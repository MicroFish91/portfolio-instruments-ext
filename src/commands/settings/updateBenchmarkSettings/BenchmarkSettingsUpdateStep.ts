import { Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { BenchmarkSettingsUpdateContext } from "./BenchmarkSettingsUpdateContext";
import { updateSettings, UpdateSettingsApiResponse } from "../../../sdk/settings/updateSetting";

export class BenchmarkSettingsUpdateStep<T extends BenchmarkSettingsUpdateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Updating target benchmark..." });

        const response: UpdateSettingsApiResponse = await updateSettings(context.token, context.settings.user_id, {
            reb_thresh_pct: context.settings.reb_thresh_pct,
            benchmark_id: context.benchmarkId,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.updatedSettings = response.data?.settings;
    }

    shouldExecute(context: T): boolean {
        return !context.updatedSettings;
    }
}
