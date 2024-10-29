import logging
from collections import deque

from dash import Dash, html, dcc, Output, Input, Patch, _dash_renderer
import dash_mantine_components as dmc
import plotly.graph_objs as go
import dash_daq as daq

from air_pressure.air_pressure_subscriber import AirPressureSubscriber

logger = logging.getLogger(__name__)

_dash_renderer._set_react_version("18.2.0")
app = Dash(external_stylesheets=dmc.styles.ALL)


air_pressure_queue = deque(maxlen=10)
air_pressure_subscriber = AirPressureSubscriber(data_buffer=air_pressure_queue)
air_pressure_subscriber.start()

app.layout = dmc.MantineProvider(
    dmc.AppShell([
        html.H1("Air Pressure Dashboard", style={'text-align': 'center'}),
        html.Div([
            html.H2("Air Pressure Explanation", style={'border': '1px solid black', 'text-align': 'center'}),
            dcc.Graph(id='air-pressure-bar-graph',
                      figure={
                          'data': [
                              go.Bar(x=list(range(10)),
                                     y=list(air_pressure_queue),
                                     )
                          ],
                          'layout': go.Layout(title='Air Pressure Bar Graph',
                                              xaxis={'title': 'Time', 'range': [-0.5, 9.5]},
                                              yaxis={'title': 'hPa', 'range': [0, 10]},
                                              paper_bgcolor='#f9f9f9',
                                              )
                      }
                      ),
            daq.Gauge(
                id='air-pressure-gauge',
                color={"gradient": True, "ranges": {"green": [0, 6], "yellow": [6, 8], "red": [8, 10]}},
                value=2,
                label='Default',
                max=10,
                min=0,
            ),
            dcc.Interval(id='air-pressure-interval', interval=500, n_intervals=0)
        ])
        # make the background color fill the entire page
    ], style={'background-color': '#f9f9f9', 'height': '100%', 'width': '100%', 'overflow': 'auto'})
)


@app.callback(
    Output('air-pressure-bar-graph', 'figure'),
    Input('air-pressure-interval', 'n_intervals'))
def update_bar_graph(_):
    logger.debug(f"Air pressure queue: {list(air_pressure_queue)}")
    patched_figure = Patch()
    patched_figure.data = [go.Bar(x=list(range(10)), y=list(air_pressure_queue))]
    return patched_figure


@app.callback(
    Output('air-pressure-gauge', 'value'),
    Output('air-pressure-gauge', 'label'),
    Input('air-pressure-interval', 'n_intervals'))
def update_gauge(_):
    return air_pressure_subscriber.current_value, f"{air_pressure_subscriber.current_value} hPa"


if __name__ == '__main__':
    app.run_server(debug=True)
