/* global Plotly */
import React from 'react';
import Plotly from 'plotly.js'

class PlotlyGraph extends React.Component {

  drawPlot = (data, options) => {
    Plotly.newPlot(this.props.graphID, data, options, {
       modeBarButtonsToRemove: [
         'hoverCompareCartesian',
         'hoverClosestCartesian',
         'sendDataToCloud',
         'autoScale2d',
         'pan2d',
         'zoom2d'
       ]
    });
  }

  componentDidMount() {
    this.drawPlot(this.props.data, this.props.graphOptions);
  }

  componentDidUpdate() {
    this.drawPlot(this.props.data, this.props.graphOptions);
    if(this.props.clickable) {
      document.getElementById(this.props.graphID).on('plotly_click', function(data){
        if(data.points[0].data.name !== 'Rest') {
          window.location = `asn/${data.points[0].data.name}`
        }
      });
    }
  }

  render() {
    return (
      <div id={this.props.graphID}></div>
    )
  }
}

export default PlotlyGraph;
