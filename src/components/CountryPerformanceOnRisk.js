import React, { Component } from 'react';
import PlotlyGraph from './Plot.js'


class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      graphOptions: {}
    }
  }


  computeState() {
    let xValues = ['2017-01-01','2017-01-08','2017-01-15'];
    let state = {
      data : [
        {
          x: xValues,
          y: [2,4,6],
          name: 'example N1',
          type: 'scatter'
        },
        {
          x: xValues,
          y: [1,4,7],
          name: 'example N2',
          type: 'scatter'
        }
      ],
      graphOptions: {
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
      }
    }
    return state
  }

  componentDidMount() {
    this.setState(this.computeState())
  };


  render() {
    return (
      <div>
        <PlotlyGraph data={this.state.data} graphOptions={this.state.graphOptions} />
      </div>
    );
  }
}

export default CountryPerformanceOnRisk;
