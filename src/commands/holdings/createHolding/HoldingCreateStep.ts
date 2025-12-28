import { Progress } from "vscode";
import { HoldingCreateContext } from "./HoldingCreateContext";
import { createHolding } from "../../../sdk/holdings/createHolding";
import { nonNullProp } from "../../../utils/nonNull";
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { CreateHoldingResponse } from "../../../sdk/portfolio-instruments-api";

export class HoldingCreateStep<T extends HoldingCreateContext> extends ExecuteStep<T> {
    priority: 200;

    async execute(context: T, progress: Progress<{ message?: string; increment?: number }>) {
        progress.report({ message: "Creating holding..." });

        const response: CreateHoldingResponse = await createHolding(context.token, {
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

        context.holding = response.data?.holding;
    }

    shouldExecute(context: T): boolean {
        return !context.holding;
    }
}
