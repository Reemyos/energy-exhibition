import React from 'react';
import BaseApp from './BaseApp.js';
import { BarChartWithPNG } from './components';
import { barOptions, voltageToCoulomb, voltageToJoules } from "./utils";
import hebrewIndex from './assets/images/index_hebrew.jpg'
import englishIndex from './assets/images/index_english.png'
import arabicIndex from './assets/images/index_arabic.png'
import hebrewMain from './assets/images/main_hebrew.jpg'

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
    const { voltage, currentLanguageIndex } = this.state;

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
      <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', height: '4000px', marginTop: '2000px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BarChartWithPNG data={voltage} min={0} max={maxVoltage} backgroundColor={'#01a6e1'} strokeColor={'rgba(1,166,225,0.7)'} />
          <p style={{ fontSize: '8rem', }}>{voltage.toFixed(1)}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '-3000px' }}>
          <BarChartWithPNG data={voltageToCoulomb(voltage)} min={0} max={maxCoulomb} backgroundColor={'#695cc7'} strokeColor={'rgba(105,92,199,0.7)'} />
          <p style={{ fontSize: '8rem', }}>{voltageToCoulomb(voltage).toFixed(1)}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '-3000px' }}>
          <BarChartWithPNG data={voltageToJoules(voltage)} min={0} max={maxJoule} backgroundColor={'#ff6a01'} strokeColor={'rgba(255,106,1,0.7)'} />
          <p style={{ fontSize: '8rem', }}>{voltageToJoules(voltage).toFixed(1)}</p>
        </div>
      </div>
    );

    if (voltage >= threshold) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyItems: 'center',
          alignItems: 'center',
          backgroundImage: `url(${hebrewMain})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: 'center',
          width: '4500px',
          height: '8000px',
          scale: '15%'
        }}>
          {barChart()}
        </div>
      );
    } else if (voltage < 0) {
      this.updateLanguage()
    }

    const indexPaths = {
      'hebrew': hebrewIndex,
      'english': englishIndex,
      'arabic': arabicIndex,
    }

    const indexPath = indexPaths[this.languages[currentLanguageIndex]]
    return (
      <div>
        <img src={indexPath} width={'100%'} height={'100%'}
          alt={''} />
      </div>
    );
  }
}


export default ExtendedApp;
