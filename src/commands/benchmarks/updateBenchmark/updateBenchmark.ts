import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { BenchmarksItem } from "../../../tree/benchmarks/BenchmarksItem";
import { ext } from "../../../extensionVariables";
import { BenchmarkUpdateContext } from "./BenchmarkUpdateContext";
import { BenchmarkNameStep } from "../createBenchmark/BenchmarkNameStep";
import { BenchmarkDescriptionStep } from "../createBenchmark/BenchmarkDescriptionStep";
import { BenchmarkAssetCategoriesStep } from "../createBenchmark/BenchmarkAssetCategoriesStep";
import { BenchmarkAssetAmountsStep } from "../createBenchmark/BenchmarkAssetAmountsStep";
import { BenchmarkRealReturnStep } from "../createBenchmark/BenchmarkRealReturnStep";
import { BenchmarkStdDevStep } from "../createBenchmark/BenchmarkStdDevStep";
import { BenchmarkDrawdownYearsStep } from "../createBenchmark/BenchmarkDrawdownYearsStep";
import { BenchmarkItem } from "../../../tree/benchmarks/BenchmarkItem";
import { BenchmarkUpdateStep } from "./BenchmarkUpdateStep";
import { BenchmarkRebalanceThresholdStep } from "../createBenchmark/BenchmarkRebalanceThresholdStep";

export async function updateBenchmark(context: CommandContext, item: BenchmarkItem): Promise<void> {
    const wizardContext: BenchmarkUpdateContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        benchmark: item.benchmark,
    };

    const wizard: Wizard<BenchmarkUpdateContext> = new Wizard(wizardContext, {
        title: l10n.t('Update benchmark'),
        promptSteps: [
            new BenchmarkNameStep(),
            new BenchmarkDescriptionStep(),
            new BenchmarkAssetCategoriesStep(),
            new BenchmarkAssetAmountsStep(),
            new BenchmarkRebalanceThresholdStep(),
            new BenchmarkRealReturnStep(),
            new BenchmarkStdDevStep(),
            new BenchmarkDrawdownYearsStep(),
        ],
        executeSteps: [
            new BenchmarkUpdateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Updated benchmark "{0}"', nonNullValueAndProp(wizardContext.updatedBenchmark, 'name')));
    ext.resourceCache.delete(BenchmarksItem.generatePiExtBenchmarksId(wizardContext.email));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}