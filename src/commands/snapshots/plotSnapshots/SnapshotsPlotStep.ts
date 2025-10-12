import * as vscode from 'vscode';
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { SnapshotsPlotContext } from "./SnapshotsPlotContext";
import { ext } from '../../../extensionVariables';
import { Snapshot } from '../../../sdk/types/snapshots';
import { nonNullProp, nonNullValue } from '../../../utils/nonNull';
import { getIncrementingDate, getMonthFromDate, getMonthFromMonthYearLabel, getYearFromDate, getYearFromMonthYearLabel } from '../../../utils/dateUtils';

export class SnapshotsPlotStep<T extends SnapshotsPlotContext> extends ExecuteStep<T> {
    priority: 250;

    constructor() {
        super();
    }

    async execute(context: T) {
        const viewType: string = 'snapshotsLinePlot';
        const title: string = 'Net Worth Over Time';

        const panel = vscode.window.createWebviewPanel(viewType, title, vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = this.generateWebviewContent(context, panel);
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshots?.length;
    }

    private generateWebviewContent(context: T, panel: vscode.WebviewPanel): string {
        const plotJsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(ext.context.extensionUri, 'src', 'commands', 'snapshots', 'plotSnapshots', 'plot.js'));
        const minifiedChartJsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(ext.context.extensionUri, 'resources', 'libs', 'chart.min.js'));

        const snapshots: Snapshot[] = this.dedupeSnapshotsByMonth(nonNullProp(context, 'snapshots'));
        const { xAxis, yAxis } = this.calculateChartAxisValues(snapshots);

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Snapshots Line Plot</title>
            </head>
            <body>
                <canvas id="chart"></canvas>

                <script>
                    // Pass in snapshot data
                    const xAxis = ${JSON.stringify(xAxis)};
                    const yAxis = ${JSON.stringify(yAxis)};
                </script>

                <script src="${minifiedChartJsUri}"></script>
                <script src="${plotJsUri}"></script>
            </body>
            </html>
        `;
    }

    private calculateChartAxisValues(snapshots: Snapshot[]): { xAxis: string[], yAxis: number[] } {
        const startYear: number = Number(nonNullValue(nonNullValue(snapshots.at(-1)).snap_date.split('/').at(-1)));
        const endYear: number = Number(nonNullValue(nonNullValue(snapshots.at(0)).snap_date.split('/').at(-1)));

        const xAxis: string[] = this.calculateXAxisValues(startYear, endYear + 1);
        const yAxis: number[] = this.calculateYAxisValues(snapshots, xAxis);

        return { xAxis, yAxis };
    }

    private calculateXAxisValues(startYear: number, endYear: number): string[] {
        const xAxis: string[] = [];

        let date: string = '';
        for (let i = 0; i < (endYear - startYear) * 12; i++) {
            if (i === 0) {
                date = `01/${startYear}`;
                xAxis.push(`Jan-${startYear}`);
                continue;
            }

            const incremented = getIncrementingDate(date);
            date = incremented.date;
            xAxis.push(incremented.monthYearLabel);
        }

        return xAxis;
    }

    private calculateYAxisValues(snapshots: Snapshot[], xAxis: string[]): number[] {
        const yAxis: number[] = new Array(xAxis.length).fill(null);

        const reversedSnapshots: Snapshot[] = snapshots.reverse();

        let x: number = 0;
        for (const snapshot of reversedSnapshots) {
            while (x < xAxis.length) {
                const yearMonthLabel: string = xAxis[x];
                const xAxisMonth: number = Number(getMonthFromMonthYearLabel(yearMonthLabel));
                const xAxisYear: number = Number(getYearFromMonthYearLabel(yearMonthLabel));

                const snapshotMonth: number = Number(getMonthFromDate(snapshot.snap_date));
                const snapshotYear: number = Number(getYearFromDate(snapshot.snap_date));

                if (xAxisMonth === snapshotMonth && xAxisYear && snapshotYear) {
                    yAxis[x] = snapshot.total;
                    x++;
                    break;
                }

                x++;
            }
        }

        return yAxis;
    }

    private dedupeSnapshotsByMonth(snapshots: Snapshot[]): Snapshot[] {
        return snapshots.reduce(((dedupedSnapshots: Snapshot[], currentSnapshot: Snapshot) => {
            const lastSnapshot: Snapshot | undefined = dedupedSnapshots.at(-1);
            if (!lastSnapshot) {
                dedupedSnapshots.push(currentSnapshot);
                return dedupedSnapshots;
            }

            const lastSnapshotDate: string = nonNullProp(lastSnapshot, 'snap_date');
            const lastSnapshotMonth: number = Number(getMonthFromDate(lastSnapshotDate));
            const lastSnapshotYear: number = Number(getYearFromDate(lastSnapshotDate));

            const currentSnapshotDate: string = nonNullProp(currentSnapshot, 'snap_date');
            const currentSnapshotMonth: number = Number(getMonthFromDate(currentSnapshotDate));
            const currentSnapshotYear: number = Number(getYearFromDate(currentSnapshotDate));

            if (lastSnapshotMonth === currentSnapshotMonth && lastSnapshotYear === currentSnapshotYear) {
                return dedupedSnapshots;
            }

            dedupedSnapshots.push(currentSnapshot);
            return dedupedSnapshots;

        }), [] as Snapshot[]);
    }
}
