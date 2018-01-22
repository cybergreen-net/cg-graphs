/* global Plotly */
import React from 'react';
import Plotly from 'plotly.js'

class PlotlyGraph extends React.Component {

  drawPlot = (data, options) => {
    options.images = [{
      "source": '/static/images/cybergreen-logo-square.png',
      "xref": "paper",
      "yref": "paper",
      "x": 0.57,
      "y": 0.37,
      "sizex": 0.3,
      "sizey": 0.3,
      "opacity": 0.2,
      "xanchor": "right",
      "yanchor": "bottom"
    }]
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
    if (this.props.clickable) {
      document.getElementById(this.props.graphID).on('plotly_click', function(data) {
        if (data.points[0].data.name !== 'Rest') {
          window.open(`asn/${data.points[0].data.name}`, '_blank')
        }
      });
    }
  }

  render() {
    return ( <
      div id = {
        this.props.graphID
      } > < /div>
    )
  }
}

export default PlotlyGraph;
