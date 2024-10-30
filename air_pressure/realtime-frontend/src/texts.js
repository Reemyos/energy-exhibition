import React from "react";
import './App.css';

const hebrewPageTitle = <h1 className={'Hebrew'}>טיל אוויר דחוס</h1>;

const hebrewInstructionsTitle = <h1 className={'Hebrew'}>הוראות:</h1>;

const hebrewInstructions =
    <p className={'Hebrew'}>
        1. אחזו בפיית הבקבוק ולחצו בחזקה כלפי מטה<br/>
        2. התסתכלו על השעון מכוון וחכו עד שיגיע לאזור הירוק <br/>
        3. שחררו במהירות<br/>
    </p>;

const hebrewExplanation =
    <p className={'Hebrew'}>
        דחיסת האוויר בבקבוק אוגרת בתוכו אנרגיה פוטנציאלית, המשתחררת והופכת לאנרגית תנועה וגובה כאשר הבקבוק עף.<br/>
        אגירת אנרגיה באוויר דחוס נעשית בעיקר במדחסים (קומפרסורים) המשמשים להפעלת כלי עבודה וציוד פניאומטי,<br/>
        אך הצורך באגירת אנרגיה ממקורות מתחדשים הביא לפיתוח טכנולוגיות ומתקני אגירה בקנה מידה תעשייתי.<br/>
        יתרונות השימוש באוויר דחוס כמאגר ומקור משקלו הם במשקלו הנמוך ומחירו הזול. אך כדי לאגור כמות משמעותית של<br/>
        אנרגיה יש צורך צריך נפחים ובלחצים גבוהים. דחיסת אוויר למערות וחללים בקרקע (במקום במכלי מתכת ענקיים
        ויקרים)<br/>
        היא דוגמה יפה.
    </p>;

const hebrewGaugeTitle = <h1 className={'Hebrew'}>הלחץ במיכל:</h1>;

const hebrewEnergyTitle = <h1 className={'Hebrew'}>האנרגיה במיכל:</h1>;

export const texts = {
    'Hebrew': {
        pageTitle: hebrewPageTitle,
        explanation: hebrewExplanation,
        instructionsTitle: hebrewInstructionsTitle,
        instructions: hebrewInstructions,
        gaugeTitle: hebrewGaugeTitle,
        energyTitle: hebrewEnergyTitle
    },
    'English': {
        pageTitle: null,
        explanation: null,
        instructionsTitle: null,
        instructions: null,
        gaugeTitle: null,
        energyTitle: null
    },
    'Arabic': {
        pageTitle: null,
        explanation: null,
        instructionsTitle: null,
        instructions: null,
        gaugeTitle: null,
        energyTitle: null
    }
}

export function fillTextAccordingToLanguage(language, gaugeAndBar) {
    return (
        <>
            {texts[language].pageTitle}
            {texts[language].explanation}
            {texts[language].instructionsTitle}
            {texts[language].instructions}
            {gaugeAndBar(texts[language].gaugeTitle, texts[language].energyTitle)}
            {/*{texts[language].energyTitle}*/}
            {/*{barChart}*/}
        </>
    );
}