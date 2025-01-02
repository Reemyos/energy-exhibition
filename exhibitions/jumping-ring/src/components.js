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
  const maxBarHeight = 41; // Adjust this to fit the PNG container if needed
  const normalizedData = (data - min) / (max - min); // Normalize the data between 0 and 1
  const barLength = normalizedData * maxBarHeight;

  return (
    <div
      style={{
        width: '400px',     // Fixed width
        height: '500px',    // Fixed height
        backgroundImage: `url(${barContainer})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center bottom', // Align to bottom
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: `transformX(-50%)`,
          bottom: '106.9px',
          left: '45.2%',
          width: '10.7%', // Adjust bar width percentage as needed
          height: `${barLength}%`, // Dynamically set height based on normalized data
          backgroundColor: backgroundColor, // Bar color
          border: `3px solid ${strokeColor}`, // Adjust border width if needed
        }}
      />
    </div>
  );
};
