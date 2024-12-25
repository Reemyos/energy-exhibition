import React from "react";
import {Bar} from "react-chartjs-2";
import {Chart, registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

export function BarChart({data, options}) {
    return <div style={{height: '40vh', width: '15vw', display: 'flex'}}>
        <Bar
            data={data}
            options={options}
        />
    </div>
}