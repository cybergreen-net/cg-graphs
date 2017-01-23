/* global Plotly */
import React from 'react';
import Plotly from "plotly.js"

class Plot extends React.Component {
  
  drawPlot = (data) => {
    Plotly.newPlot('plot', data, {
      title : 'Global DDOS potential',
      height: 600,
      barmode: 'stack',
      xaxis: {
        title: '*This chart assumes an average 1 mbit/sec Internet connection for every IP address.',
        gridcolor: 'transparent',
      },
      yaxis: {
        title: 'GBit/sec'
      }
    }, {
      displayModeBar: false
    });
  }

  componentDidMount() {
    this.drawPlot(this.props.data);
  }
  
  componentDidUpdate() {
    this.drawPlot(this.props.data);
  }

  render() {
    return (
      <div id="plot"></div>
    );
  }
}

export default Plot;