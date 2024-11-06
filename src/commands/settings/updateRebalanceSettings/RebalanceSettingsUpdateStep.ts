import { Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { updateSettings, UpdateSettingsApiResponse } from "../../../sdk/settings/updateSettings";
import { RebalanceSettingsUpdateContext } from "./RebalanceSettingsUpdateContext";
import { nonNullProp } from "../../../utils/nonNull";

export class RebalanceSettingsUpdateStep<T extends RebalanceSettingsUpdateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Updating rebalance threshold..." });

        const response: UpdateSettingsApiResponse = await updateSettings(context.token, context.settings.user_id, {
            reb_thresh_pct: nonNullProp(context, 'rebalanceThreshold'),
            benchmark_id: context.settings.benchmark_id,
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
