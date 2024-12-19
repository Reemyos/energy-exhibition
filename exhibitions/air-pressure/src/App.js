import React from 'react';
import BaseApp from './BaseApp.js';
import {FillTextAccordingToLanguage} from './texts';
import {EnergyChart, GaugeChart} from './components';
import {pressureToCalorie, pressureToJoule} from "./utils";


const minPressure = 0;
const maxPressure = 1.5;

export function getGaugeData(currentPressure) {
    return [
        ["Label", "Value"],
        ["atm", currentPressure],
    ];
}

export class ExtendedApp extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            dataPoint: 0,
            gaugeData: getGaugeData(0),
        };
    }

    handleMessage = (event) => {
        const newDataPoint = parseFloat(event.data) / 10;
        this.setState((prevState) => ({
            dataPoint: newDataPoint,
            gaugeData: getGaugeData(newDataPoint),
        }));
    };

    renderContent() {
        const {dataPoint, gaugeData, currentLanguageIndex} = this.state;

        const jouleChartData = {
            labels: ['Joules'],
            datasets: [
                {
                    label: 'Joules',
                    data: [pressureToJoule(dataPoint)],
                    backgroundColor: 'rgba(100, 220, 150, 0.2)',
                    borderColor: 'rgba(100, 220, 150, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const calorieChartData = {
            labels: ['Calories'],
            datasets: [
                {
                    label: 'Calories',
                    data: [pressureToCalorie(dataPoint)],
                    backgroundColor: 'rgba(90, 99, 250, 0.2)',
                    borderColor: 'rgba(90, 99, 250, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                }
            ],
        };

        const barOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: Math.max(pressureToJoule(maxPressure), pressureToCalorie(maxPressure)),
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
                legend: {display: false},
            },
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
            <div style={{display: 'grid', justifyItems: 'center', gridColumnGap: '100px', marginBottom: '20%'}}>
                <div style={{gridRow: 1, gridColumn: 1}}>{gaugeTitle}</div>
                <div style={{gridRow: 2, gridColumn: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingTop: '100%'}}>
                    <GaugeChart data={gaugeData} options={gaugeOptions}/>
                </div>
                <div style={{gridRow: 1, gridColumn: 2, marginLeft: '15%'}}>{energyTitle}</div>
                <div style={{gridRow: 2, gridColumn: 2, display: 'flex', flexDirection: 'row', paddingLeft: '20%'}}>
                    <EnergyChart data={jouleChartData} options={barOptions}/>
                    <EnergyChart data={calorieChartData} options={barOptions}/>
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
