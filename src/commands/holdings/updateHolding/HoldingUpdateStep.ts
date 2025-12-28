import { Progress } from "vscode";
import { nonNullProp } from "../../../utils/nonNull";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { HoldingUpdateContext } from "./HoldingUpdateContext";
import { updateHolding } from "../../../sdk/holdings/updateHolding";
import { UpdateHoldingResponse } from "../../../sdk/portfolio-instruments-api";

export class HoldingUpdateStep<T extends HoldingUpdateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Updating holding..." });

        const response: UpdateHoldingResponse = await updateHolding(context.token, context.holding.holding_id, {
            name: nonNullProp(context, 'holdingName'),
            asset_category: nonNullProp(context, 'holdingAssetCategory'),
            ticker: context.holdingTicker,
            expense_ratio_pct: context.holdingExpenseRatioPct,
            interest_rate_pct: context.holdingInterestRatePct,
            maturation_date: context.holdingMaturationDate,
            is_deprecated: false,
        });
        if (response.error) {
            throw new Error(response.error);
        }

        context.updatedHolding = response.data?.holding;
    }

    shouldExecute(context: T): boolean {
        return !context.updatedHolding;
    }
}
