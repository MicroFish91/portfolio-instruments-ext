import { l10n } from "vscode";
import { nonNullValue, nonNullValueAndProp } from "../../../utils/nonNull";
import { getAuthToken } from "../../../utils/tokenUtils";
import { Wizard } from "../../../wizard/Wizard";
import { CommandContext } from "../../registerCommand";
import { ext } from "../../../extensionVariables";
import { BenchmarkDeleteContext } from "./BenchmarkDeleteContext";
import { BenchmarkItem } from "../../../tree/benchmarks/BenchmarkItem";
import { BenchmarkDeleteConfirmStep } from "./BenchmarkDeleteConfirmStep";
import { BenchmarkDeleteStep } from "./BenchmarkDeleteStep";
import { BenchmarksItem } from "../../../tree/benchmarks/BenchmarksItem";

export async function deleteBenchmark(context: CommandContext, item: BenchmarkItem): Promise<void> {
    const wizardContext: BenchmarkDeleteContext = {
        ...context,
        email: item.email,
        token: nonNullValue(await getAuthToken(item.email)),
        benchmark: item.benchmark,
    };

    const wizard: Wizard<BenchmarkDeleteContext> = new Wizard(wizardContext, {
        title: l10n.t('Create a financial account'),
        promptSteps: [
            new BenchmarkDeleteConfirmStep(),
        ],
        executeSteps: [
            new BenchmarkDeleteStep(),
        ],
    });

    await wizard.prompt();
    await wizard.execute();

    void context.ui.showInformationMessage(l10n.t('Deleted benchmark "{0}"', nonNullValueAndProp(wizardContext.benchmark, 'name')));
    ext.resourceCache.delete(BenchmarksItem.generatePiExtBenchmarksId(wizardContext.email));
    ext.portfolioInstrumentsTdp.refresh(item.parent);
}