/* global Plotly */
import React from 'react';
import Plotly from 'plotly.js'
import Loader from 'halogen/BounceLoader';
import '../css/temp.css';

class PlotlyGraph extends React.Component {

  drawPlot = (data, options) => {
    Plotly.newPlot(this.props.graphID, data, options, {displayModeBar: false});
  }

  componentDidMount() {
    this.drawPlot(this.props.data, this.props.graphOptions);
  }

  componentDidUpdate() {
    this.drawPlot(this.props.data, this.props.graphOptions);
    if(this.props.clickable) {
      document.getElementById(this.props.graphID).on('plotly_click', function(data){
        if(data.points[0].data.name !== 'Rest') {
          window.location = `/asn/${data.points[0].data.name}`
        }
      });
    }
  }

  render() {
    if(this.props.data.length === 0) {
      return (
        <div id={this.props.graphID}>
          <div className='graphSpinner'>
            <Loader size='40px' color='#00D49A'/>
          </div>
        </div>
      )
    }
    return (
      <div id={this.props.graphID}></div>
    );
  }
}

export default PlotlyGraph;
