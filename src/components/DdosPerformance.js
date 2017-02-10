import React, { Component } from 'react';
import setDataFromUrl from './../utils/Points.js'
import Plot from './Plot.js'

class DdosPerformance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    for (var i = 0; i < this.props.urls.length; i++) {
      setDataFromUrl(this, this.props.urls[i].url, this.props.urls[i].name);
    }
  };

  render() {
    const graphOptions = {
      height: 600,
      xaxis: {
       title: '*This chart assumes an average 1 mbit/sec Internet connection for every IP address.',
       gridcolor: 'transparent',
      },
      yaxis: {
       title: 'GBit/sec'
      },
      barmode: 'stack'
    }
    return (
      <div>
        <Plot data={this.state.data} graphOptions={graphOptions} graphID={'ddos'}/>
      </div>
    );
  }
}

export default DdosPerformance;
