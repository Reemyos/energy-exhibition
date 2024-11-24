import React from 'react';
import BaseApp from './BaseApp.js';
import { FillTextAccordingToLanguage } from './texts';
import { EnergyChart, GaugeChart } from './components';

export function getGaugeData(currentPressure) {
    return [
        ["Label", "Value"],
        ["KPA", currentPressure],
    ];
}

export class ExtendedApp extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            dataPoint: [0],
            gaugeData: getGaugeData(0),
        };
    }

    handleMessage = (event) => {
        const newDataPoint = parseFloat(event.data);
        this.setState((prevState) => ({
            dataPoint: [newDataPoint],
            gaugeData: getGaugeData(newDataPoint),
        }));
    };

    renderContent() {
        const { dataPoint, gaugeData, currentLanguageIndex } = this.state;
        const chartData = {
            labels: dataPoint.map((_, index) => index + 1),
            datasets: [
                {
                    label: 'Pressure',
                    data: dataPoint,
                    backgroundColor: dataPoint.map((point) => {
                        if (point >= 8) return 'rgba(81, 255, 150, 0.2)';
                        if (point >= 6) return 'rgba(255, 206, 86, 0.2)';
                        return 'rgba(75, 192, 192, 0.2)';
                    }),
                    borderColor: dataPoint.map((point) => {
                        if (point >= 8) return 'rgba(81, 255, 150, 1)';
                        if (point >= 6) return 'rgba(255, 206, 86, 1)';
                        return 'rgba(75, 192, 192, 1)';
                    }),
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const barOptions = {
            scales: {
                y: { beginAtZero: true, min: 0, max: 10, title: { display: true, text: 'Energy' } },
                x: { beginAtZero: true, min: 0, max: 1 },
            },
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
        };

        const gaugeOptions = {
            responsive: true,
            greenFrom: 8,
            greenTo: 10,
            yellowFrom: 6,
            yellowTo: 8,
            minorTicks: 3,
            min: 0,
            max: 10,
            majorTicks: [0, 2, 4, 6, 8, 10],
        };

        const gaugeAndEnergy = (gaugeTitle, energyTitle) => (
            <div style={{ display: 'grid', justifyItems: 'center', gridColumnGap: '100px' }}>
                <div style={{ gridRow: 1, gridColumn: 1 }}>{gaugeTitle}</div>
                <div style={{ gridRow: 2, gridColumn: 1, paddingRight: '80%' }}>
                    <GaugeChart data={gaugeData} options={gaugeOptions} />
                </div>
                <div style={{ gridRow: 1, gridColumn: 2, marginLeft: '15%' }}>{energyTitle}</div>
                <div style={{ gridRow: 2, gridColumn: 2 }}>
                    <EnergyChart data={chartData} options={barOptions} />
                </div>
            </div>
        );

        return FillTextAccordingToLanguage(
            this.languages[currentLanguageIndex],
            gaugeAndEnergy
        );
    }
}

export default ExtendedApp;
