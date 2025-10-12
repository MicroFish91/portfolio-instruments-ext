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