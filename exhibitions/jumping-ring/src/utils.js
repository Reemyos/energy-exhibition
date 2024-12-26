export function voltageToCoulomb(voltage) {
    return voltage * 0.0047;
}

export function voltageToJoules(voltage) {
    return (voltage * voltageToCoulomb(voltage)) / 2
}

export function barOptions(maxVal, margin) {
    return {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: maxVal + margin,
                    ticks: {display: false},
                    grid: {display: false},
                    border: {display: false},
                },
                x: {
                    grid: {display: false},
                    border: {display: false},
                },
            },
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false,
            barPercentage: 0.5,
            plugins: {
                legend: { display: false },
                datalabels: {
                    color: '#000', // Label color
                    anchor: 'end', // Position the label near the bar's end
                    align: 'top',  // Align the label on top of the bar
                    formatter: (value) => value.toFixed(2), // Format the label value
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                }
            }
        };
}
