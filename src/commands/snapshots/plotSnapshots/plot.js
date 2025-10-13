document.addEventListener('DOMContentLoaded', () => {
    const data = {
        labels: xAxis,
        datasets: [{
            label: 'Net Worth ($)',
            data: yAxis,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.2
        }],
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Net Worth Over Time'
                },
                annotation: {
                    annotations: verticalAnnotations.map((va) => {
                        return {
                            type: 'line',
                            mode: 'vertical',
                            scaleID: 'x',
                            value: va.xAxis,
                            borderColor: 'white', 
                            borderWidth: 2,
                            label: {
                                content: [
                                    va.xAxis.split('-')[1],
                                    `Annual Increase: ${va.annualIncreasePct?.toFixed(2) ?? '--'}%`,
                                    `Estimated Total: $${va.rawTotal.toFixed(2)}`
                                ],
                                display: true, 
                                position: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                color: 'black', // Text color
                                font: {
                                    size: 12,
                                },
                            },
                        };
                    })
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Net Worth ($)'
                    }
                }
            },
            spanGaps: true,
        }
    };

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, config);
});