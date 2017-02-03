import React, { Component } from 'react';
import setDataFromUrl from './../utils/Points.js'
import Plot from './Plot.js'


class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }


  componentDidMount() {
  };


  render() {
    let xValues = ['2017-01-01','2017-01-08','2017-01-15'];
    let trace = [
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
    ];
    return (
      <div>
        <Plot data={trace} />
      </div>
    );
  }
}

export default CountryPerformanceOnRisk;
