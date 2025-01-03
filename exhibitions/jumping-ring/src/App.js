import React from 'react';
import BaseApp from './BaseApp.js';
import { BarChartWithPNG } from './components';
import { voltageToCoulomb, voltageToJoules } from "./utils";
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
    this.setState(() => ({
      voltage: newVoltage
    }));
  };

  renderContent() {
    const { voltage, currentLanguageIndex } = this.state;

    const maxVoltage = 300;
    const maxCoulombs = 1.5;
    const maxJoules = 220;

    const barChart = () => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '500px', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', flex: 1, height: '100%', width: '100%' }}>
          <BarChartWithPNG data={voltage} min={0} max={maxVoltage} backgroundColor={'#01a6e1'} strokeColor={'rgba(1,166,225,0.7)'} />
          <p style={{ fontSize: '1rem', }}>{voltage.toFixed(1)}</p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyItems: 'center',
          flex: 1,
          marginLeft: '-1050px',
          height: '100%',
          width: '100%'
        }}>
          <BarChartWithPNG data={voltageToCoulomb(voltage)} min={0} max={maxCoulombs} backgroundColor={'#695cc7'} strokeColor={'rgba(105,92,199,0.7)'} />
          <p style={{ fontSize: '1rem', }}>{voltageToCoulomb(voltage).toFixed(1)}</p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyItems: 'center',
          flex: 1,
          marginLeft: '-1050px',
          height: '100%',
          width: '100%'
        }}>
          <BarChartWithPNG data={voltageToJoules(voltage)} min={0} max={maxJoules} backgroundColor={'#ff6a01'} strokeColor={'rgba(255,106,1,0.7)'} />
          <p style={{ fontSize: '1rem', }}>{voltageToJoules(voltage).toFixed(1)}</p>
        </div>
      </div>
    );

    if (voltage >= threshold) {
      return (
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eafcf9'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${hebrewMain})`,
            backgroundSize: 'contain', // Scale image to fit
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%', // Scale proportionally to fit screen
          }}>
            {barChart()}
          </div>
        </div>
      )
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
