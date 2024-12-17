import React from 'react';
import BaseApp from './BaseApp.js';
import {FillTextAccordingToLanguage} from './texts';
import {EnergyChart, GaugeChart} from './components';


const minPressure = 0;
const maxPressure = 1.5;

export function getGaugeData(currentPressure) {
    return [
        ["Label", "Value"],
        ["ATM", currentPressure],
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
        const newDataPoint = (parseFloat(event.data) / 10) * maxPressure;
        this.setState((prevState) => ({
            dataPoint: [newDataPoint],
            gaugeData: getGaugeData(newDataPoint),
        }));
    };

    renderContent() {
        const {dataPoint, gaugeData, currentLanguageIndex} = this.state;
        const colorMappingBackground = (point) => {
            if (point >= 1.3) return 'rgba(255, 99, 132, 0.2)';
            if (point >= 0.8) return 'rgba(255, 206, 86, 0.2)';
            if (point >= 0.4) return 'rgba(81, 255, 150, 0.2)';
            return 'rgba(75, 192, 192, 0.2)';
        };

        const colorMappingBorder = (point) => {
            if (point >= 1.3) return 'rgba(255, 99, 132, 1)';
            if (point >= 0.8) return 'rgba(255, 206, 86, 1)';
            if (point >= 0.4) return 'rgba(81, 255, 150, 1)';
            return 'rgba(75, 192, 192, 1)';
        }

        const chartData = {
            labels: dataPoint.map((_, index) => index + 1),
            datasets: [
                {
                    label: 'Pressure',
                    data: dataPoint,
                    backgroundColor: dataPoint.map(colorMappingBackground),
                    borderColor: dataPoint.map(colorMappingBorder),
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const barOptions = {
            scales: {
                y: {beginAtZero: true, min: minPressure, max: maxPressure, title: {display: true, text: 'Energy'}},
                x: {beginAtZero: true, min: 0, max: 1},
            },
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false,
            plugins: {legend: {display: false}},
        };

        const gaugeOptions = {
            responsive: true,
            greenFrom: 0.4,
            greenTo: 0.8,
            yellowFrom: 0.8,
            yellowTo: 1.3,
            redFrom: 1.3,
            redTo: 1.5,
            minorTicks: 3,
            min: minPressure,
            max: maxPressure,
            majorTicks: [0, 0.5, 1, 1.5],
        };

        const gaugeAndEnergy = (gaugeTitle, energyTitle) => (
            <div style={{display: 'grid', justifyItems: 'center', gridColumnGap: '100px'}}>
                <div style={{gridRow: 1, gridColumn: 1}}>{gaugeTitle}</div>
                <div style={{gridRow: 2, gridColumn: 1, paddingRight: '80%'}}>
                    <GaugeChart data={gaugeData} options={gaugeOptions}/>
                </div>
                <div style={{gridRow: 1, gridColumn: 2, marginLeft: '15%'}}>{energyTitle}</div>
                <div style={{gridRow: 2, gridColumn: 2}}>
                    <EnergyChart data={chartData} options={barOptions}/>
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
