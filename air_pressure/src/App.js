import React, {useEffect, useState} from 'react';
import './App.css'
import {FillTextAccordingToLanguage} from "./texts";
import {EnergyChart, GaugeChart} from "./components";

export function getGaugeData(currentPressure) {
    return [
        ["Label", "Value"],
        ["KPA", currentPressure],
    ];
}


const App = () => {
    const [dataPoint, setDataPoint] = useState([0]);
    const [gaugeData, setGaugeData] = useState(getGaugeData(0));
    const [currentLanguageIndex, setIndex] = useState(0)
    const [isConnected, setIsConnected] = useState(false);

    const reconnectIntervalRef = React.useRef(null);
    const languages = ['Hebrew', 'English', 'Arabic']

    function changeLanguage() {
        setIndex((currentLanguageIndex + 1) % 3)
    }

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            if (ws?.readyState === WebSocket.OPEN) return; // Prevent new connection if already open

            ws = new WebSocket('ws://localhost:9001');

            ws.onopen = () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true);

                // Clear any existing reconnection interval
                if (reconnectIntervalRef.current) {
                    clearInterval(reconnectIntervalRef.current);
                    reconnectIntervalRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                const newDataPoint = parseFloat(event.data);
                setDataPoint([newDataPoint]);
                setGaugeData(getGaugeData(newDataPoint));
            };

            ws.onclose = () => {
                console.log('Disconnected from WebSocket server');
                setIsConnected(false);

                // Attempt to reconnect only if no reconnect interval is active
                if (!reconnectIntervalRef.current) {
                    reconnectIntervalRef.current = setInterval(() => {
                        console.log('Attempting to reconnect...');
                        connectWebSocket();
                    }, 5000);
                }
            };
        };

        connectWebSocket();

        // Clean up on component unmount
        return () => {
            if (reconnectIntervalRef.current) {
                clearInterval(reconnectIntervalRef.current);
            }
            if (ws) ws.close();
        };
    }, []);

    const chartData = {
        labels: dataPoint.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Pressure',
                data: dataPoint,
                backgroundColor: dataPoint.map(point => {
                    if (point >= 8) return 'rgba(81, 255, 150, 0.2)'; // Green
                    if (point >= 6) return 'rgba(255, 206, 86, 0.2)'; // Yellow
                    return 'rgba(75, 192, 192, 0.2)'; // Default (light blue)
                }),
                borderColor: dataPoint.map(point => {
                    if (point >= 8) return 'rgba(81, 255, 150, 1)'; // Green
                    if (point >= 6) return 'rgba(255, 206, 86, 1)'; // Yellow
                    return 'rgba(75, 192, 192, 1)'; // Default (blue)
                }),
                borderWidth: 1,
                tension: 0.1,
            },
        ],
    };

    const barOptions = {
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
                max: 1
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

    function gaugeAndEnergy(gaugeTitle, energyTitle) {
        return <div style={{display: 'grid', justifyItems: 'center', gridColumnGap: '100px'}}>
            <div style={{gridRow: 1, gridColumn: 1}}>
                {gaugeTitle}
            </div>
            <div style={{gridRow: 2, gridColumn: 1, marginTop: '5%'}}>
                <GaugeChart data={gaugeData} options={gaugeOptions}/>
            </div>
            <div style={{gridRow: 1, gridColumn: 2, marginLeft: '15%'}}>
                {energyTitle}
            </div>
            <div style={{gridRow: 2, gridColumn: 2}}>
                <EnergyChart data={chartData} options={barOptions}/>
            </div>
        </div>
    }

    // LED-style connection indicator
    const connectionIndicatorStyle = {
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        backgroundColor: isConnected ? '#339409' : '#ad0909',
        marginTop: '10px',
        marginLeft: '10px',
        display: 'inline-block',
        alignSelf: 'flex-start',
    };

    return (
        <div className={'App-container'}>
            <div style={connectionIndicatorStyle}></div>
            {FillTextAccordingToLanguage(languages[currentLanguageIndex], gaugeAndEnergy)}
            <button onClick={changeLanguage} style={{marginTop: '10px'}}>
                {languages[currentLanguageIndex]}
            </button>
        </div>
    );
};

export default App;
