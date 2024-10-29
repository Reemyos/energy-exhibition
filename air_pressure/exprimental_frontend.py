from collections import deque
from nicegui import ui

from air_pressure.air_pressure_subscriber import AirPressureSubscriber

echart = ui.echart(
    {
        'title': {'text': 'Air Pressure Visualisation'},
        'xAxis': {'type': 'value', 'min': 0, 'max': 10, 'title': 'Time'},
        'yAxis': {'type': 'value', 'min': 0, 'max': 10, 'title': 'hPa'},
        'series': [
            {'type': 'bar', 'data': [[i - 0.5, 10] for i in range(1, 11)]},
        ],
    }
)

high_chart = ui.highchart({
    'title': {'text': 'Air Pressure Visualisation'},
    'chart': {'type': 'solidgauge'},
    'yAxis': {
        'min': 0,
        'max': 10,
    },
    'series': [
        {'data': [10]},
    ],
}, extras=['solid-gauge'])

air_pressure_subscriber = AirPressureSubscriber(data_buffer=deque(maxlen=10), echart=echart, high_chart=high_chart)
air_pressure_subscriber.start()


ui.run()
