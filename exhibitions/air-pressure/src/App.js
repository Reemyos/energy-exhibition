import React from 'react';
import BaseApp from './BaseApp.js';
import { DesignedGaugeChart, BarChartWithPNG } from './components';
import { pressureToCalorie, pressureToJoule } from "./utils";
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
      lastDataPoint: 0,
      currentHighScore: 0,
    };
  }

  handleMessage = (event) => {
    const newDataPoint = parseFloat(event.data) / 10;

    this.setState((prevState) => {
      return {
        dataPoint: newDataPoint,
        lastDataPoint: prevState.dataPoint,
        currentHighScore: Math.max(newDataPoint, prevState.dataPoint),
      };
    }, () => {
      // Use the updated state to determine whether to log
      if (!newDataPoint && this.state.lastDataPoint) {
        this.log(`Current highscore: ${this.state.lastDataPoint}`);
        this.state.currentHighScore = 0;
      }
    });
  };

  renderContent() {
    const { dataPoint, currentLanguageIndex } = this.state;

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
        backgroundSize: 'contain',
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            marginLeft: '70%',
            marginTop: '8%',
            width: '100%',
            height: '100%'
          }}>
            <DesignedGaugeChart data={dataPoint} min={minPressure} max={maxPressure} />
          </div>
          <p style={{ fontSize: '1.5rem', marginTop: '-11.5%' }}>{dataPoint.toFixed(1)}</p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-5.3%',
          height: '500px',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <BarChartWithPNG data={pressureToJoule(dataPoint)} min={0} max={maxBar} backgroundColor={'#70D64D'} strokeColor={'rgba(112, 214, 77, 0.7)'} />
            <p style={{ fontSize: '1.5rem', paddingBottom: '29%', marginTop: '-15%' }}>{pressureToJoule(dataPoint).toFixed(1)}</p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: '-18.5%'
            }}>
            <BarChartWithPNG data={pressureToCalorie(dataPoint)} min={0} max={maxBar} backgroundColor={'#B9E972'} strokeColor={'rgba(185, 233, 114, 0.7)'} />
            <p style={{ fontSize: '1.5rem', paddingBottom: '29%', marginTop: '-15%' }}>{pressureToCalorie(dataPoint).toFixed(1)}</p>
          </div>
        </div>
      </div>
    );

    if (dataPoint >= 0) {
      return <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#eafcf9'
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
          alt={''} />
      </div>
    );
  }
}


export default ExtendedApp;
