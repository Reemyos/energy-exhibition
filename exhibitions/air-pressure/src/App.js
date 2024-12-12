import React from 'react';
import BaseApp from './BaseApp.js';
import { FillTextAccordingToLanguage } from './texts';
import { EnergyChart, DesignedGaugeChart } from './components';

const pressureMax = 10;

export class ExtendedApp extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            dataPoint: [0],
            gaugeData: 0,
        };
    }

    handleMessage = (event) => {
        const newDataPoint = parseFloat(event.data);
        this.setState((prevState) => ({
            dataPoint: [newDataPoint],
            gaugeData: newDataPoint,
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
                y: { beginAtZero: true, min: 0, max: pressureMax, title: { display: true, text: 'Energy' } },
                x: { beginAtZero: true, min: 0, max: 1 },
            },
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
        };

        const gaugeAndEnergy = (gaugeTitle, energyTitle) => (
            <div style={{ display: 'grid', justifyItems: 'center', gridColumnGap: '100px' }}>
                <div style={{ gridRow: 1, gridColumn: 1 }}>{gaugeTitle}</div>
                <div style={{ gridRow: 2, gridColumn: 1, paddingRight: '20vw', paddingTop: '10vh' }}>
                    <DesignedGaugeChart data={gaugeData} min={0} max={pressureMax} />
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
