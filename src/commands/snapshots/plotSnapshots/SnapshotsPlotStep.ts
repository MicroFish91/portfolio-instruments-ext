import * as vscode from 'vscode';
import { ExecuteStep } from "../../../wizard/ExecuteStep";
import { SnapshotsPlotContext } from "./SnapshotsPlotContext";

export class SnapshotsPlotStep<T extends SnapshotsPlotContext> extends ExecuteStep<T> {
    priority: 250;

    constructor() {
        super();
    }

    async execute(context: T) {
        const viewType: string = 'snapshotsLinePlot';
        const title: string = 'Snapshots Line Plot';

        const panel = vscode.window.createWebviewPanel(viewType, title, vscode.ViewColumn.One,
            { enableScripts: true, /** Enable JavaScript in the webview */ },
        );
        panel.webview.html = this.getWebviewContent(context);
    }

    shouldExecute(context: T): boolean {
        return !!context.snapshots?.length;
    }

    private getWebviewContent(_context: T): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Snapshots Line Plot</title>
            </head>
            <body>
                <canvas id="chart"></div>

                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script>
                    const ctx = document.getElementById('chart').getContext('2d');
                    const myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                            datasets: [{
                                label: '# of Votes',
                                data: [12, 19, 3, 5, 2, 3],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                </script>

            </body>
            </html>
        `;
    }
}
