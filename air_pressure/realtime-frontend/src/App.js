import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import mqtt from 'mqtt';
import {Chart as GoogleChart} from 'react-google-charts';
import {Chart, registerables} from 'chart.js';
import './App.css'
import {fillTextAccordingToLanguage} from "./texts";

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
    const [currentLanguageIndex, setIndex] = useState(0)

    const languages = ['Hebrew', 'English', 'Arabic']

    function changeLanguage() {
        setIndex((currentLanguageIndex + 1) % 3)
    }

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
                return prevDataPoints.length >= 1 ? prevDataPoints.slice(-1) : newDataPoint;
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
                max: 1,
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
        majorTicks: [0, 2, 4, 6, 8, 10]
    };

    const gaugeChart = (
        <div style={{height: '100%', aspectRatio: 1, display: 'flex', justifyContent: 'center'}}>
            <GoogleChart
                chartType="Gauge"
                data={gaugeData}
                options={gaugeOptions}
            />
        </div>
    );

    const barChart = (
        <div style={{height: '40vh', aspectRatio: "1:5"}}>
            <Bar
                data={chartData}
                options={options}
            />
        </div>
    );

    const gaugeAndBar = (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {gaugeChart}
            {barChart}
        </div>
    );

    return (
        <div className={'App-container'}>
            {fillTextAccordingToLanguage(languages[currentLanguageIndex], gaugeAndBar)}
            <button onClick={changeLanguage} style={{marginTop: '10px'}}>
                {languages[currentLanguageIndex]}
            </button>
        </div>
    );
};

export default App;
