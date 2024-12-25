import React from "react";
import './App.css';

const hebrewPageTitle = <h1 className={'Hebrew Title'}>טיל אוויר דחוס</h1>;

const hebrewInstructions =
    <div style={{display: 'flex', alignItems: 'center', width: '100vw', marginBottom: '10%'}}>
        <img src={require("./assets/images/instructions.png")} alt={'instructions'} width={'75%'}/>
    </div>

const hebrewGaugeTitle = <h2 className={'Hebrew Subtitle'}>הלחץ במיכל:</h2>;

const hebrewEnergyTitle = <h2 className={'Hebrew Subtitle'}>האנרגיה במיכל:</h2>;

export const texts = {
    'Hebrew': {
        pageTitle: hebrewPageTitle,
        instructions: hebrewInstructions,
        gaugeTitle: hebrewGaugeTitle,
        energyTitle: hebrewEnergyTitle
    },
    'English': {
        pageTitle: null,
        instructions: null,
        gaugeTitle: null,
        energyTitle: null
    },
    'Arabic': {
        pageTitle: null,
        instructions: null,
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
            {texts[language].instructions}
            {gaugeAndEnergy(texts[language].gaugeTitle, texts[language].energyTitle)}
        </div>
    );
}
