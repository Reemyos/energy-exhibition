import React from "react";
import './App.css';

const hebrewPageTitle = <h1 className={'Hebrew Title'}>טבעת קופצת</h1>;

const hebrewInstructions =
    <div style={{display: 'flex', alignSelf: 'center'}}>
        <img src={''} alt={'instructions'} width={'0%'}/>
    </div>

export const texts = {
    'Hebrew': {
        pageTitle: hebrewPageTitle,
        instructions: hebrewInstructions,
        barTitle: null
    },
    'English': {
        pageTitle: null,
        instructions: null,
        barTitle: null
    },
    'Arabic': {
        pageTitle: null,
        instructions: null,
        barTitle: null
    }
}

export function FillTextAccordingToLanguage(language, barChart) {
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
            {barChart()}
        </div>
    );
}
