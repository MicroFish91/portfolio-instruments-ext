import { Progress } from "vscode";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { ApiEndpointSetContext } from "./ApiEndpointSetContext";
import { settingUtils } from "../../../utils/settingUtils";
import { nonNullProp } from "../../../utils/nonNull";

export class ApiEndpointSetStep<T extends ApiEndpointSetContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Setting API endpoint..." });

        const newApiEndpoint: string = nonNullProp(context, 'newApiEndpoint');
        await settingUtils.updateApiEndpointBaseUrl(newApiEndpoint);
    }

    shouldExecute(): boolean {
        return true;
    }
}
