import React from 'react';
import BaseApp from './BaseApp.js';
import {FillTextAccordingToLanguage} from './texts';
import {BarChart} from './components';
import {barOptions, voltageToCoulomb, voltageToJoules} from "./utils";

const threshold = 0;

export class ExtendedApp extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            voltage: 0
        };
    }

    handleMessage = (event) => {
        const newVoltage = parseInt(event.data) * 30;
        this.setState((prevState) => ({
            voltage: newVoltage
        }));
    };

    renderContent() {
        const {voltage, currentLanguageIndex} = this.state;
        
        const voltChartData = {
            labels: ['volt'],
            datasets: [
                {
                    label: 'volt',
                    data: [voltage],
                    backgroundColor: 'rgba(100, 150, 220, 0.2)',
                    borderColor: 'rgba(100, 150, 220, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const coulombChartData = {
            labels: ['Coulomb'],
            datasets: [
                {
                    label: 'Coulomb',
                    data: [voltageToCoulomb(voltage)],
                    backgroundColor: 'rgba(100, 220, 150, 0.2)',
                    borderColor: 'rgba(100, 220, 150, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const jouleChartData = {
            labels: ['Joules'],
            datasets: [
                {
                    label: 'Joules',
                    data: [voltageToJoules(voltage)],
                    backgroundColor: 'rgba(220, 100, 150, 0.2)',
                    borderColor: 'rgba(220, 100, 150, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                },
            ],
        };

        const maxVoltage = 300;
        const voltageMargin = 100;
        const voltageBarOptions = barOptions(maxVoltage, voltageMargin);

        const maxCoulomb = 1.5;
        const coulombMargin = 0.5;
        const coulombBarOptions = barOptions(maxCoulomb, coulombMargin);

        const maxJoule = 220;
        const jouleMargin = 30;
        const jouleBarOptions = barOptions(maxJoule, jouleMargin);

        const barChart = () => (
            <div style={{display: 'flex', flexDirection: 'row', alignSelf: 'center', height: '50vh'}}>
                <BarChart data={voltChartData} options={voltageBarOptions}/>
                <BarChart data={coulombChartData} options={coulombBarOptions}/>
                <BarChart data={jouleChartData} options={jouleBarOptions}/>
            </div>
        );

        if (voltage > threshold) {
            return FillTextAccordingToLanguage(
                this.languages[currentLanguageIndex],
                barChart
            );
        } else if (voltage < 0) {
            this.updateLanguage()
        }

        const indexPath = require(`./assets/images/index_${this.languages[currentLanguageIndex]}.png`);
        return (
            <div>
                <img src={indexPath} width={'100%'} height={'100%'}
                     alt={''}/>
            </div>
        );
    }
}


export default ExtendedApp;
