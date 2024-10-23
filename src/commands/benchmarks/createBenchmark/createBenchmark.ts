import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { BenchmarksItem } from "../../../tree/benchmarks/BenchmarksItem";
import { BenchmarkCreateContext } from "./BenchmarkCreateContext";
import { ext } from "../../../extensionVariables";
import { BenchmarkNameStep } from "./BenchmarkNameStep";
import { BenchmarkDescriptionStep } from "./BenchmarkDescriptionStep";
import { BenchmarkRealReturnStep } from "./BenchmarkRealReturnStep";
import { BenchmarkStdDevStep } from "./BenchmarkStdDevStep";
import { BenchmarkDrawdownYearsStep } from "./BenchmarkDrawdownYearsStep";
import { BenchmarkAssetCategoriesStep } from "./BenchmarkAssetCategoriesStep";
import { BenchmarkAssetAmountsStep } from "./BenchmarkAssetAmountsStep";
import { BenchmarkCreateStep } from "./BenchmarkCreateStep";

export async function createBenchmark(context: CommandContext, item: BenchmarksItem): Promise<void> {
    const wizardContext: BenchmarkCreateContext = {
        ...context,
        token: nonNullValue(await getAuthToken(item.email)),
    };

    const wizard: Wizard<BenchmarkCreateContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a benchmark'),
        promptSteps: [
            new BenchmarkNameStep(),
            new BenchmarkDescriptionStep(),
            new BenchmarkAssetCategoriesStep(),
            new BenchmarkAssetAmountsStep(),
            new BenchmarkRealReturnStep(),
            new BenchmarkStdDevStep(),
            new BenchmarkDrawdownYearsStep(),
        ],
        executeSteps: [
            new BenchmarkCreateStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Created benchmark "{0}"', nonNullValueAndProp(wizardContext.benchmark, 'name')));
    ext.portfolioInstrumentsTdp.refresh(item);
}