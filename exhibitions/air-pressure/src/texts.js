import React from "react";
import './App.css';

const hebrewPageTitle = <h1 className={'Hebrew Title'}>טיל אוויר דחוס</h1>;

const hebrewGaugeTitle = <h2 className={'Hebrew Subtitle'}>הלחץ במיכל:</h2>;

const hebrewEnergyTitle = <h2 className={'Hebrew Subtitle'}>האנרגיה במיכל:</h2>;

export const texts = {
    'hebrew': {
        pageTitle: hebrewPageTitle,
        gaugeTitle: hebrewGaugeTitle,
        energyTitle: hebrewEnergyTitle
    },
    'english': {
        pageTitle: null,
        gaugeTitle: null,
        energyTitle: null
    },
    'arabic': {
        pageTitle: null,
        gaugeTitle: null,
        energyTitle: null
    }
}

export function FillTextAccordingToLanguage(language, gaugeAndEnergy) {
    return (
        <div style={{
            height: '100vh',
            width: '70vw',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            {texts[language].pageTitle}
            {gaugeAndEnergy(texts[language].gaugeTitle, texts[language].energyTitle)}
        </div>
    );
}
