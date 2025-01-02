import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import barContainer from './assets/images/components/bar_container.png'

Chart.register(...registerables, ChartDataLabels);

export function BarChart({ data, options }) {
  return <div style={{ height: '40vh', width: '15vw', display: 'flex' }}>
    <Bar
      data={data}
      options={options}
    />
  </div>
}

export const BarChartWithPNG = ({ data, min, max, strokeColor, backgroundColor }) => {
  const maxBarHeight = 3200; // Adjust this to fit the PNG container if needed
  const normalizedData = (data - min) / (max - min); // Normalize the data between 0 and 1
  const barLength = normalizedData * maxBarHeight;

  return (
    <div
      style={{
        width: '100%', // Use relative width for responsiveness
        height: '100%', // Use relative height for responsiveness
        backgroundImage: `url(${barContainer})`,
        backgroundSize: 'contain', // Ensure the PNG fits without distortion
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '29.7%', // Position bars from the bottom to ensure they grow upwards
          left: '51%', // Center horizontally
          transform: 'translateX(-50%)', // Center the bar by adjusting with translateX
          width: '11%', // Adjust bar width percentage as needed for responsiveness
          height: `${barLength}px`, // Dynamically set the height based on normalized data
          backgroundColor: backgroundColor, // Bar color
          border: `3px solid ${strokeColor}`, // Adjust border width if needed
        }}
      />
    </div>
  );
};

