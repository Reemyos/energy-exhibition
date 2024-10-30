import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import mqtt from 'mqtt';
import { Chart as GoogleChart } from 'react-google-charts';
import { Chart, registerables } from 'chart.js';

// Register necessary components
Chart.register(...registerables);

export function getGaugeData(currentPressure) {
    return [
        ["Label", "Value"],
        ["Bar", currentPressure],
    ];
}

const App = () => {
    const [dataPoints, setDataPoints] = useState([]);
    const [gaugeData, setGaugeData] = useState(getGaugeData(0));

    const hebrew_instuctions =
        <p style={{direction: 'rtl'}}>
            1. אחזו בפיית הבקבוק ולחצו בחזקה כלפי מטה<br/>
            2. התסתכלו על השעון מכוון וחכו עד שיגיע לאזור הירוק <br/>
             3. שחררו במהירות<br/>
        </p>;

    const hebrew_explanation =
        <p style={{direction: 'rtl'}}>
            דחיסת האוויר בבקבוק אוגרת בתוכו אנרגיה פוטנציאלית, המשתחררת והופכת לאנרגית תנועה וגובה כאשר הבקבוק עף.<br/>
            אגירת אנרגיה באוויר דחוס נעשית בעיקר במדחסים (קומפרסורים) המשמשים להפעלת כלי עבודה וציוד פניאומטי,<br/>
            אך הצורך באגירת אנרגיה ממקורות מתחדשים הביא לפיתוח טכנולוגיות ומתקני אגירה בקנה מידה תעשייתי.<br/>
            יתרונות השימוש באוויר דחוס כמאגר ומקור משקלו הם במשקלו הנמוך ומחירו הזול. אך כדי לאגור כמות משמעותית של<br/>
            אנרגיה יש צורך צריך נפחים ובלחצים גבוהים. דחיסת אוויר למערות וחללים בקרקע (במקום במכלי מתכת ענקיים ויקרים)<br/>
            היא דוגמה יפה.
        </p>;

    useEffect(() => {
        const client = mqtt.connect('ws://localhost:9001'); // Change if needed

        client.on('connect', () => {
            console.log('Connected to MQTT broker');
            client.subscribe('sensor/data', (err) => {
                if (!err) {
                    console.log('Subscribed to sensor/data topic');
                }
            });
        });

        client.on('message', (topic, message) => {
            const newDataPoint = parseFloat(message.toString());
            // Keep only the last 10 data points
            setDataPoints((prevDataPoints) => {
                prevDataPoints.push(newDataPoint);
                return prevDataPoints.length >= 10 ? prevDataPoints.slice(-10) : prevDataPoints;
            });
            setGaugeData(getGaugeData(newDataPoint));
        });

        return () => {
            client.end();
        };
    }, []);

    const chartData = {
        labels: dataPoints.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Pressure',
                data: dataPoints,
                backgroundColor: dataPoints.map(point => {
                    if (point >= 8) return 'rgba(81, 255, 150, 0.2)'; // Green
                    if (point >= 6) return 'rgba(255, 206, 86, 0.2)'; // Yellow
                    return 'rgba(75, 192, 192, 0.2)'; // Default (light blue)
                }),
                borderColor: dataPoints.map(point => {
                    if (point >= 8) return 'rgba(81, 255, 150, 1)'; // Green
                    if (point >= 6) return 'rgba(255, 206, 86, 1)'; // Yellow
                    return 'rgba(75, 192, 192, 1)'; // Default (blue)
                }),
                borderWidth: 1,
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 10,
                title: {
                    display: true,
                    text: 'אנרגיה',
                },
            },
            x: {
                beginAtZero: true,
                min: 0,
                max: 10,
                title: {
                    display: true,
                    text: 'זמן',
                },
            }
        },
        responsive: true,
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false, // Disable the legend
        },
    },
    };


    const gaugeOptions = {
        responsive: true,
        greenFrom: 8,
        greenTo: 10,
        yellowFrom: 6,
        yellowTo: 8,
        minorTicks: 3,
        min: 0,
        max: 10,
    };

    return (
        <div style={{ backgroundColor: '#fafafa', alignContent: 'center', display: 'flex', flexDirection: "column",
        alignItems: 'center', height: '100%'}}>
            <h1>טיל אוויר דחוס</h1>
            {hebrew_explanation}
            <h2 style={{direction: 'rtl'}}>הוראות:</h2>
            {hebrew_instuctions}
            <h2 style={{direction: 'rtl'}}>הלחץ במיכל כעת:</h2>
            <div style={{height: '100%', aspectRatio: 1, display: 'flex', justifyContent: 'center'}}>
                <GoogleChart
                    chartType="Gauge"
                    data={gaugeData}
                    options={gaugeOptions}
                />
            </div>
            <h2 style={{direction: 'rtl'}}>אנרגיה לאורך זמן במיכל:</h2>
            <div style={{ height: '50vh', aspectRatio: 2 }}>
                <Bar
                    data={chartData}
                    options={options}
                />
            </div>
        </div>
    );
};

export default App;
