import React from "react";
import './App.css';

const hebrewPageTitle = <h1 className={'Hebrew Title'}>טיל אוויר דחוס</h1>;

const hebrewInstructions =
    <p className={'Hebrew Text'}>
        <strong>אחזו</strong> הבקבוק ולחצו בחזקה כלפי מטה<br/>
        <strong>התסתכלו</strong> על השעון מכוון וחכו עד שיגיע לאזור הירוק <br/>
        <strong>שחררו </strong> במהירות<br/>
    </p>
;

const hebrewExplanation =
    <p className={'Hebrew Text'}>
        דחיסת האוויר בבקבוק אוגרת בתוכו אנרגיה פוטנציאלית, המשתחררת והופכת לאנרגית תנועה וגובה כאשר הבקבוק עף.<br/>
        אגירת אנרגיה באוויר דחוס נעשית בעיקר במדחסים (קומפרסורים) המשמשים להפעלת כלי עבודה וציוד פניאומטי,<br/>
        אך הצורך באגירת אנרגיה ממקורות מתחדשים הביא לפיתוח טכנולוגיות ומתקני אגירה בקנה מידה תעשייתי.<br/>
        יתרונות השימוש באוויר דחוס כמאגר ומקור משקלו הם במשקלו הנמוך ומחירו הזול. אך כדי לאגור כמות משמעותית של<br/>
        אנרגיה יש צורך צריך נפחים ובלחצים גבוהים. דחיסת אוויר למערות וחללים בקרקע (במקום במכלי מתכת ענקיים
        ויקרים)<br/>
        היא דוגמה יפה.
    </p>;

const hebrewGaugeTitle = <h2 className={'Hebrew Subtitle'}>הלחץ במיכל:</h2>;

const hebrewEnergyTitle = <h2 className={'Hebrew Subtitle'}>האנרגיה במיכל:</h2>;

export const texts = {
    'Hebrew': {
        pageTitle: hebrewPageTitle,
        explanation: hebrewExplanation,
        instructions: hebrewInstructions,
        gaugeTitle: hebrewGaugeTitle,
        energyTitle: hebrewEnergyTitle
    },
    'English': {
        pageTitle: null,
        explanation: null,
        instructions: null,
        gaugeTitle: null,
        energyTitle: null
    },
    'Arabic': {
        pageTitle: null,
        explanation: null,
        instructions: null,
        gaugeTitle: null,
        energyTitle: null
    }
}

export function FillTextAccordingToLanguage(language, gaugeAndEnergy) {
    return (
        <>
            {texts[language].pageTitle}
            {texts[language].instructions}
            {gaugeAndEnergy(texts[language].gaugeTitle, texts[language].energyTitle)}
            {texts[language].explanation}
        </>
    );
}