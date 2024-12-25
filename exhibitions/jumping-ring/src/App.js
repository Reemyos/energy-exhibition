import React from 'react';
import BaseApp from './BaseApp.js';
import {FillTextAccordingToLanguage} from './texts';
import {BarChart} from './components';
import {voltageToAmp} from "./utils";


const maxVoltage = 936;

export class ExtendedApp extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            voltage: 0
        };
    }

    handleMessage = (event) => {
        const newVoltage = parseInt(event.data) * 93.6;
        this.setState((prevState) => ({
            voltage: newVoltage
        }));
    };

    renderContent() {
        const {voltage, currentLanguageIndex} = this.state;

        const ampChartData = {
            labels: ['Amp'],
            datasets: [
                {
                    label: 'Amp',
                    data: [voltageToAmp(voltage)],
                    backgroundColor: 'rgba(100, 220, 150, 0.2)',
                    borderColor: 'rgba(100, 220, 150, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const valueMargin = 50;
        const barOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: voltageToAmp(maxVoltage) + valueMargin,
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

        const barChart = (title) => (
            <div style={{display: 'grid', justifyItems: 'center', gridColumnGap: '100px', marginBottom: '20%'}}>
                <div style={{gridRow: 1, gridColumn: 1}}>{title}</div>
                <div style={{gridRow: 2, gridColumn: 1, display: 'flex', flexDirection: 'row'}}>
                    <BarChart data={ampChartData} options={barOptions}/>
                </div>
            </div>
        );

        return FillTextAccordingToLanguage(
            this.languages[currentLanguageIndex],
            barChart
        );
    }
}


export default ExtendedApp;
