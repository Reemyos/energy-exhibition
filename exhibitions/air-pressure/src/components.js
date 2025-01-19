import React from "react";
import './idGeneratedStyles.css';
import gaugeBackground from './assets/images/components/gauge_background.png'
import gaugePin from './assets/images/components/gauge_pin.png'
import barContainer from './assets/images/components/bar_container.png'


export function DesignedGaugePin({ data, min, max }) {
  // Rotate the pin according to the data
  const angle = ((data - min) / (max - min)) * 195;
  const pointerStyle = {
    marginTop: '-75.5%',
    transform: ` rotate(${angle}deg)`,
    transformOrigin: '15% 50%',
  }

  return (
    <div style={pointerStyle}>
      <img src={gaugePin} alt={'Pin'} width={'80%'} />
    </div>
  );
}


export function DesignedGaugeChart({ data, min, max }) {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative'
  }}>
    <div>
      <img src={gaugeBackground} alt={'Background'} width={'80%'} />
    </div>
    <DesignedGaugePin data={data} min={min} max={max} />
  </div>
}

export const BarChartWithPNG = ({ data, min, max, strokeColor, backgroundColor }) => {
  const maxBarHeight = 41; // Adjust this to fit the PNG container if needed
  const normalizedData = (data - min) / (max - min); // Normalize the data between 0 and 1
  const barLength = normalizedData * maxBarHeight;

  return (
    <div
      style={{
        width: '50vh',
        height: '60vh',    // Fixed height
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
          bottom: '21.8%',
          left: '45.4%',
          width: '10.9%', // Adjust bar width percentage as needed
          height: `${barLength}%`, // Dynamically set height based on normalized data
          backgroundColor: backgroundColor, // Bar color
          border: `3px solid ${strokeColor}`, // Adjust border width if needed
        }}
      />
    </div>
  );
};
