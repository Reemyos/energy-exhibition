import {Chart as GoogleChart} from "react-google-charts";
import React from "react";
import {Bar} from "react-chartjs-2";
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);


export function GaugeChart({data, options}) {
        return <div style={{height: '100%', aspectRatio: 1, display: 'flex', justifyContent: 'center', marginTop: '10%'}}>
            <GoogleChart
                chartType="Gauge"
                data={data}
                options={options}
            />
        </div>
    }

export function EnergyChart({data, options}) {
        return <div style={{height: '40vh', aspectRatio: "1:5"}}>
            <Bar
                data={data}
                options={options}
            />
        </div>
    }

