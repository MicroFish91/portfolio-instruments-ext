import * as vscode from 'vscode';
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { SnapshotsPlotContext } from "./SnapshotsPlotContext";
import { ext } from '../../../extensionVariables';
import { Snapshot } from '../../../sdk/types/snapshots';
import { nonNullProp, nonNullValue } from '../../../utils/nonNull';
import { convertDateToISOFormat, getIncrementingDate, getMonthFromDate, getMonthFromMonthYearLabel, getYearFromDate, getYearFromMonthYearLabel, months } from '../../../utils/dateUtils';

type VerticalAnnotation = {
    annualIncreasePct?: number;
    rawTotal: number;
    xAxis: string;
};

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
        const plotJsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(ext.context.extensionUri, 'resources', 'chart', 'plot.js'));
        const minifiedChartJsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(ext.context.extensionUri, 'resources', 'chart', 'chart.min.js'));
        const minifiedChartAnnotationJsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(ext.context.extensionUri, 'resources', 'chart', 'chart.annotation.min.js'));

        const snapshots: Snapshot[] = this.dedupeSnapshotsByMonth(nonNullProp(context, 'snapshots')).reverse();
        const { xAxis, yAxis } = this.calculateChartAxisValues(snapshots);
        const verticalAnnotations: VerticalAnnotation[] = this.getAnnualizedChartAnnotations(snapshots);

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Net Worth Over Time</title>
            </head>
            <body>
                <canvas id="chart"></canvas>

                <script>
                    // Pass in snapshot data
                    const xAxis = ${JSON.stringify(xAxis)};
                    const yAxis = ${JSON.stringify(yAxis)};
                    const verticalAnnotations = ${JSON.stringify(verticalAnnotations)};
                </script>

                <script src="${minifiedChartJsUri}"></script>
                <script src="${minifiedChartAnnotationJsUri}"></script>
                <script src="${plotJsUri}"></script>
            </body>
            </html>
        `;
    }

    private calculateChartAxisValues(snapshots: Snapshot[]): { xAxis: string[], yAxis: number[] } {
        const startYear: number = Number(nonNullValue(nonNullValue(snapshots.at(0)).snap_date.split('/').at(-1)));
        const endYear: number = Number(nonNullValue(nonNullValue(snapshots.at(-1)).snap_date.split('/').at(-1)));

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

        let x: number = 0;
        for (const snapshot of snapshots) {
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

    private getAnnualizedChartAnnotations(snapshots: Snapshot[]): VerticalAnnotation[] {
        const annotations: VerticalAnnotation[] = [];

        let lastSnapshot: Snapshot | undefined;
        for (const snapshot of snapshots) {
            if (!lastSnapshot) {
                lastSnapshot = snapshot;
                continue;
            }

            const lastSnapshotYear: number = Number(getYearFromDate(lastSnapshot.snap_date));
            const currentSnapshotYear: number = Number(getYearFromDate(snapshot.snap_date));

            if ((currentSnapshotYear - lastSnapshotYear) === 1) {
                const snapshotOne = { value: lastSnapshot.total, date: lastSnapshot.snap_date };
                const snapshotTwo = { value: snapshot.total, date: snapshot.snap_date };

                const annotation = estimatePortfolioAnnotation(snapshotOne, snapshotTwo, `01/01/${currentSnapshotYear}`);
                const lastAnnotation = annotations.at(-1);

                if (lastAnnotation) {
                    annotation.annualIncreasePct = (annotation.rawTotal - lastAnnotation.rawTotal) / lastAnnotation.rawTotal * 100;
                } else {
                    annotation.annualIncreasePct = (annotation.rawTotal - snapshots[0].total) / snapshot.total * 100;
                }

                annotations.push(annotation);
            }

            lastSnapshot = snapshot;
        }

        return annotations;
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

/**
 * Estimates the portfolio value on a target date using linear interpolation.
 * The provided snapshots should be in date order and be within one year of each other.
 * 
 * @param value Portfolio snapshot value at the time
 * @param date Portfolio snapshot date (mm/dd/yyyy)
 * @param targetDate Date we want to estimate a value for (mm/dd/yyyy)
 */
export function estimatePortfolioAnnotation(snapshotOne: { value: number, date: string }, snapshotTwo: { value: number, date: string }, targetDate: string): VerticalAnnotation {
    if (Math.abs(Number(getYearFromDate(snapshotOne.date)) - Number(getYearFromDate(snapshotTwo.date))) > 1) {
        throw new Error('Snapshot dates are more than a year apart.');
    }

    if (snapshotOne.date === targetDate) {
        return {
            xAxis: targetDate,
            rawTotal: snapshotOne.value,
        };
    }

    if (snapshotTwo.date === targetDate) {
        return {
            xAxis: targetDate,
            rawTotal: snapshotTwo.value,
        };
    }

    const timeOne: number = new Date(convertDateToISOFormat(snapshotOne.date)).getTime();
    const timeTwo: number = new Date(convertDateToISOFormat(snapshotTwo.date)).getTime();
    const targetTime: number = new Date(convertDateToISOFormat(targetDate)).getTime();

    if (timeOne >= timeTwo) {
        throw new Error("Snapshot 1 must be earlier than Snapshot 2.");
    }

    const estimatedValue: number = snapshotOne.value +
        ((targetTime - timeOne) / (timeTwo - timeOne)) * (snapshotTwo.value - snapshotOne.value);

    const [month, _, year] = targetDate.split('/');

    return {
        xAxis: `${months[Number(month) - 1]}-${year}`,
        rawTotal: estimatedValue,
    };
}
