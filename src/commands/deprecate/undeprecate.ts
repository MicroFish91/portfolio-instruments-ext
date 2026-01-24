import { l10n, window } from "vscode";
import { nonNullValue } from "../../utils/nonNull";
import { getAuthToken } from "../../utils/tokenUtils";
import { CommandContext } from "../registerCommand";
import { ext } from "../../extensionVariables";
import { AccountDeprecatedItem } from "../../tree/accounts/AccountDeprecatedItem";
import { HoldingDeprecatedItem } from "../../tree/holdings/HoldingDeprecatedItem";
import { BenchmarkDeprecatedItem } from "../../tree/benchmarks/BenchmarkDeprecatedItem";
import { updateAccount } from "../../sdk/accounts/updateAccount";
import { updateHolding } from "../../sdk/holdings/updateHolding";
import { updateBenchmark } from "../../sdk/benchmarks/updateBenchmark";
import { AccountsItem } from "../../tree/accounts/AccountsItem";
import { HoldingsItem } from "../../tree/holdings/HoldingsItem";
import { BenchmarksItem } from "../../tree/benchmarks/BenchmarksItem";

type DeprecatedItem = AccountDeprecatedItem | HoldingDeprecatedItem | BenchmarkDeprecatedItem;

export async function undeprecate(context: CommandContext, item: DeprecatedItem): Promise<void> {
    const token = nonNullValue(await getAuthToken(item.email));
    const itemLabel = typeof item.label === 'string' ? item.label : item.label?.label || 'resource';
    
    const confirmMessage = l10n.t('Are you sure you want to restore "{0}" as an active resource?', itemLabel);
    const confirm = await window.showWarningMessage(confirmMessage, { modal: true }, l10n.t('Restore'));
    
    if (confirm !== l10n.t('Restore')) {
        return;
    }

    await window.withProgress(
        {
            location: { viewId: 'portfolioInstruments.main' },
            title: l10n.t('Restoring resource...'),
        },
        async () => {
            if (item instanceof AccountDeprecatedItem) {
                const response = await updateAccount(token, item.account.account_id, {
                    name: item.account.name,
                    description: item.account.description,
                    institution: item.account.institution,
                    tax_shelter: item.account.tax_shelter,
                    is_deprecated: false,
                });
                if (response.error) {
                    throw new Error(response.error);
                }
                ext.resourceCache.delete(AccountsItem.generatePiExtAccountsId(item.email));
                ext.portfolioInstrumentsTdp.refresh(item.parent);
            } else if (item instanceof HoldingDeprecatedItem) {
                const response = await updateHolding(token, item.holding.holding_id, {
                    name: item.holding.name,
                    ticker: item.holding.ticker,
                    asset_category: item.holding.asset_category,
                    expense_ratio_pct: item.holding.expense_ratio_pct,
                    maturation_date: item.holding.maturation_date,
                    interest_rate_pct: item.holding.interest_rate_pct,
                    is_deprecated: false,
                });
                if (response.error) {
                    throw new Error(response.error);
                }
                ext.resourceCache.delete(HoldingsItem.generatePiExtHoldingsId(item.email));
                ext.portfolioInstrumentsTdp.refresh(item.parent);
            } else if (item instanceof BenchmarkDeprecatedItem) {
                const response = await updateBenchmark(token, item.benchmark.benchmark_id, {
                    name: item.benchmark.name,
                    description: item.benchmark.description,
                    asset_allocation: item.benchmark.asset_allocation,
                    std_dev_pct: item.benchmark.std_dev_pct,
                    real_return_pct: item.benchmark.real_return_pct,
                    drawdown_yrs: item.benchmark.drawdown_yrs,
                    rec_rebalance_threshold_pct: item.benchmark.rec_rebalance_threshold_pct,
                    is_deprecated: false,
                });
                if (response.error) {
                    throw new Error(response.error);
                }
                ext.resourceCache.delete(BenchmarksItem.generatePiExtBenchmarksId(item.email));
                ext.portfolioInstrumentsTdp.refresh(item.parent);
            }
        }
    );

    void context.ui.showInformationMessage(l10n.t('Restored "{0}" as an active resource', itemLabel));
}
