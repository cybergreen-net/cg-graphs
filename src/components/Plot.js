/* global Plotly */
import React from 'react';
import Plotly from 'plotly.js'

class PlotlyGraph extends React.Component {

  drawPlot = (data, options) => {
    Plotly.newPlot('plot', data, options);
  }

  componentDidMount() {
    this.drawPlot(this.props.data, this.props.graphOptions);
  }

  componentDidUpdate() {
    this.drawPlot(this.props.data, this.props.graphOptions);
  }

  render() {
    return (
      <div id="plot"></div>
    );
  }
}

export default PlotlyGraph;
