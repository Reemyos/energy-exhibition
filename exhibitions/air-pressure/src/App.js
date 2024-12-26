import React from 'react';
import BaseApp from './BaseApp.js';
import {FillTextAccordingToLanguage} from './texts';
import {DesignedGaugeChart, EnergyChart, BarChartSVG, BarChartWithPNG} from './components';
import {pressureToCalorie, pressureToJoule} from "./utils";
import mainBackgroundHebrew from './assets/images/screens/main_hebrew.jpg'
import mainBackgroundEnglish from './assets/images/screens/main_english.jpg'
import mainBackgroundArabic from './assets/images/screens/main_arabic.jpg'


const minPressure = 0;
const maxPressure = 1.5;

export class ExtendedApp extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            dataPoint: 0,
        };
    }

    handleMessage = (event) => {
        const newDataPoint = parseFloat(event.data) / 10;
        this.setState((prevState) => ({
            dataPoint: newDataPoint,
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

        const valueMargin = 30;
        const barOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: Math.max(pressureToJoule(maxPressure), pressureToCalorie(maxPressure)) + valueMargin,
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

            barPercentage: 100,
            plugins: {
                legend: {display: false},
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


        const backgroundImageMap = {
            'hebrew': mainBackgroundHebrew,
            'english': mainBackgroundEnglish,
            'arabic': mainBackgroundArabic
        }

        const maxBar = Math.max(pressureToJoule(maxPressure), pressureToCalorie(maxPressure))
        const mainBackground = `url(${backgroundImageMap[this.languages[currentLanguageIndex]]})`
        const gaugeAndEnergy = () => (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyItems: 'center',
                alignItems: 'center',
                backgroundImage: mainBackground,
                backgroundRepeat: "no-repeat",
                backgroundPosition: 'center',
                width: '4500px',
                height: '8000px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <DesignedGaugeChart data={dataPoint} min={minPressure} max={maxPressure}/>
                </div>
                <p style={{marginTop: "-34%", fontSize: '8rem'}}>{dataPoint.toFixed(1)}</p>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: '-450px'}}>
                    <div style={{marginRight: '-3300px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <BarChartWithPNG data={pressureToJoule(dataPoint)} min={0} max={maxBar} backgroundColor={'#70D64D'} strokeColor={'rgba(112, 214, 77, 0.7)'}/>
                        <p style={{marginTop: "-750px", fontSize: '8rem', marginLeft: '100px'}}>{pressureToJoule(dataPoint).toFixed(1)}</p>
                    </div>
                    <div
                        style={{paddingRight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <BarChartWithPNG data={pressureToCalorie(dataPoint)} min={0} max={maxBar} backgroundColor={'#B9E972'} strokeColor={'rgba(185, 233, 114, 0.7)'}/>
                        <p style={{
                            marginTop: "-750px",
                            fontSize: '8rem',
                            marginLeft: '100px'
                        }}>{pressureToCalorie(dataPoint).toFixed(1)}</p>
                    </div>
                </div>
            </div>
        );

        if (dataPoint > 0) {
            return <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                scale: '25%'
            }}>
                {gaugeAndEnergy()}
            </div>;
        } else if (dataPoint < 0) {
            this.updateLanguage()
        }

        const indexPath = require(`./assets/images/screens/index_${this.languages[currentLanguageIndex]}.jpg`);
        return (
            <div>
                <img src={indexPath} width={'100%'} height={'100%'}
                     alt={''}/>
            </div>
        );
    }
}


export default ExtendedApp;
