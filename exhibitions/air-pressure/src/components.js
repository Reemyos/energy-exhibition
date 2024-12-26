import React from "react";
import {Bar} from "react-chartjs-2";
import {Chart, registerables} from 'chart.js';
import './idGeneratedStyles.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import gaugeBackground from './assets/images/components/gauge_background.png'
import gaugePin from './assets/images/components/gauge_pin.png'
import barContainer from './assets/images/components/bar_container.png'

Chart.register(...registerables, ChartDataLabels);

export function EnergyChart({data, options}) {
    return <div style={{height: '40vh', width: '15vw', display: 'flex'}}>
        <Bar
            data={data}
            options={options}
        />
    </div>
}


export function DesignedGaugePin({data, min, max}) {
    // Rotate the pin according to the data
    const angle = ((data - min) / (max - min)) * 195;
    const pointerStyle = {
        marginTop: '-94%',
        position: 'absolute',
        transform: ` rotate(${angle}deg)`,
    }

    return (
        <div style={pointerStyle}>
            <img src={gaugePin} alt={'Pin'} width={'4500px'}/>
        </div>
    );
}


export function DesignedGaugeChart({data, min, max}) {
    return <div style={{display: 'inline-block', marginTop: '25%', alignItems: 'center'}}>
        <div>
            <img src={gaugeBackground} alt={'Background'}/>
        </div>
        <DesignedGaugePin data={data} min={min} max={max}/>
    </div>
}

export const BarChartSVG = ({barValues}) => {
    const maxBarHeight = 500; // Max height of the fill (adjust according to the SVG dimensions)
    const maxValue = 100; // Maximum value in your data range
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="4500" height="3800">
            <defs>
                <style>
                    {`.cls-1 {
                        fill: none;
                        stroke: #000;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 7px;
                      }
                      .fill {
                        fill: rgba(100, 200, 255, 0.5); /* Bar fill color */
                        stroke: none;
                      }`}
                </style>
            </defs>

            {/* Background bar fills */}
            <rect
                className="fill"
                x="460"
                y={774.97 - (barValues[0] / maxValue) * maxBarHeight}
                width="15"
                height={(barValues[0] / maxValue) * maxBarHeight}
            />
            <rect
                className="fill"
                x="480"
                y={759.23 - (barValues[1] / maxValue) * maxBarHeight}
                width="15"
                height={(barValues[1] / maxValue) * maxBarHeight}
            />
            {/* Add more rectangles for each bar */}

            {/* Original bars (strokes remain on top) */}
            <path id="bar-1" className="cls-1" d="M467.27,774.97v35.89"/>
            <path id="bar-2" className="cls-1" d="M484.46,759.23v31.47"/>
            {/* Add more paths for the remaining bars */}
        </svg>
    );
};

export const BarChartWithPNG = ({data, min, max}) => {
    const maxBarHeight = 2040; // Adjust to fit your PNG container
    const normalizedData = [(data - min) / (max - min)]
    const barContainerUrl = `url(${barContainer})`
    const barLength = normalizedData * maxBarHeight;
    return (
        <div
            style={{
                // position: 'relative',
                width: '4500px', // Match the PNG dimensions
                height: '4500px',
                backgroundImage: barContainerUrl, // PNG file
                backgroundSize: 'cover',
            }}
        >
            {normalizedData.map((value, index) => (
                <div
                    key={index}
                    style={{
                        position: 'relative',
                        top: `${3200 - barLength}px`,
                        left: 2030,
                        width: '470px', // Bar width
                        height: `${barLength}px`, // Scale height based on data
                        backgroundColor: 'rgba(0, 123, 255, 0.7)', // Bar color
                        border: '40px solid #007bff',
                    }}
                />
            ))}
        </div>
    );
};


