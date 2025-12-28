import { l10n, Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { HoldingDeleteContext } from "./HoldingDeleteContext";
import { deleteHolding } from "../../../sdk/holdings/deleteHolding";
import { DeleteHoldingResponse } from "../../../sdk/portfolio-instruments-api";

export class HoldingDeleteStep<T extends HoldingDeleteContext> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: l10n.t("Deleting holding...") });

        const response: DeleteHoldingResponse = await deleteHolding(nonNullProp(context, 'token'), context.holding.holding_id);
        if (response.error) {
            throw new Error(response.error);
        }
    }

    shouldExecute(context: T): boolean {
        return !!context.holding;
    }
}
