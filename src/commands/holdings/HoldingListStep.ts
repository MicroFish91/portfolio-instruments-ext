import { l10n } from "vscode";
import { AuthContext } from "../AuthContext";
import { PromptStep } from "../../wizard/PromptStep";
import { PiQuickPickItem } from "../../wizard/UserInterface";
import { getHoldings, GetHoldingsApiResponse } from "../../sdk/holdings/getHoldings";
import { nonNullValueAndProp } from "../../utils/nonNull";
import { Holding } from "../../sdk/types/holdings";

export class HoldingListStep<T extends AuthContext & { holdingId?: number }> extends PromptStep<T> {
    async prompt(context: T): Promise<void> {
        context.holdingId = (await context.ui.showQuickPick(this.getPicks(context), {
            title: this.title,
            placeHolder: l10n.t('Select a target holding'),
        }))?.data;
    }

    shouldPrompt(context: T): boolean {
        return !context.holdingId;
    }

    private async getPicks(context: T): Promise<PiQuickPickItem<number | undefined>[]> {
        const response: GetHoldingsApiResponse = await getHoldings(context.token);
        if (response.error) {
            throw new Error(l10n.t('No holdings available - please create a holding first.'));
        }

        const holdings: Holding[] = nonNullValueAndProp(response.data, 'holdings');
        return holdings.map(holding => {
            return {
                label: holding.name,
                description: holding.asset_category,
                data: holding.holding_id,
            };
        });
    }
}