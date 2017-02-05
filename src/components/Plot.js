/* global Plotly */
import React from 'react';
import Plotly from 'plotly.js'

class PlotlyGraph extends React.Component {

  drawPlot = (data, options) => {
    Plotly.newPlot(this.props.graphID, data, options);
  }

  componentDidMount() {
    this.drawPlot(this.props.data, this.props.graphOptions);
  }

  componentDidUpdate() {
    this.drawPlot(this.props.data, this.props.graphOptions);
  }

  render() {
    return (
      <div id={this.props.graphID}></div>
    );
  }
}

export default PlotlyGraph;
