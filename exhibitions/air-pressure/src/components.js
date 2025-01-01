import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import './idGeneratedStyles.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import gaugeBackground from './assets/images/components/gauge_background.png'
import gaugePin from './assets/images/components/gauge_pin.png'
import barContainer from './assets/images/components/bar_container.png'

Chart.register(...registerables, ChartDataLabels);

export function EnergyChart({ data, options }) {
  return <div style={{ height: '40vh', width: '15vw', display: 'flex' }}>
    <Bar
      data={data}
      options={options}
    />
  </div>
}


export function DesignedGaugePin({ data, min, max }) {
  // Rotate the pin according to the data
  const angle = ((data - min) / (max - min)) * 195;
  const pointerStyle = {
    marginTop: '-94%',
    position: 'absolute',
    transform: ` rotate(${angle}deg)`,
  }

  return (
    <div style={pointerStyle}>
      <img src={gaugePin} alt={'Pin'} width={'4500px'} />
    </div>
  );
}


export function DesignedGaugeChart({ data, min, max }) {
  return <div style={{ display: 'inline-block', marginTop: '18%', alignItems: 'center' }}>
    <div>
      <img src={gaugeBackground} alt={'Background'} />
    </div>
    <DesignedGaugePin data={data} min={min} max={max} />
  </div>
}

export const BarChartWithPNG = ({ data, min, max, strokeColor, backgroundColor }) => {
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
            backgroundColor: backgroundColor, // Bar color
            border: `40px solid ${strokeColor}`,
          }}
        />
      ))}
    </div>
  );
};


