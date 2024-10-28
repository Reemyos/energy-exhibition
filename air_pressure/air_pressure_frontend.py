import logging
from collections import deque

from dash import Dash, html, dcc, Output, Input
import plotly.graph_objs as go

from air_pressure.air_pressure_subscriber import AirPressureSubscriber

logger = logging.getLogger(__name__)

app = Dash(__name__)

air_pressure_queue = deque(maxlen=10)
air_pressure_subscriber = AirPressureSubscriber(data_buffer=air_pressure_queue)
air_pressure_subscriber.start()

app.layout = html.Div([
    html.H1("Air Pressure Dashboard", style={'border': '2px solid black'}),
    html.Div([
        html.H2("Air Pressure Explanation", style={'border': '2px solid black'}),
        dcc.Graph(id='air-pressure-bar-graph', style={'border': '2px solid black'}),
        dcc.Graph(id='air-pressure-visualisation', style={'border': '2px solid black'}),
        dcc.Interval(id='air-pressure-interval', interval=1000, n_intervals=0)
    ])
])


@app.callback(
    Output('air-pressure-bar-graph', 'figure'),
    Input('air-pressure-interval', 'n_intervals'))
def update_bar_graph(_):
    logger.info(f"Air pressure queue: {list(air_pressure_queue)}")
    return {
        'data': [go.Bar(x=list(range(10)), y=list(air_pressure_queue))],
        'layout': go.Layout(title='Air Pressure Bar Graph')
    }


if __name__ == '__main__':
    app.run_server(debug=False)
