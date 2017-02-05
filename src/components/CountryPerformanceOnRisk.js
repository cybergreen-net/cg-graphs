import React, { Component } from 'react';
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      graphOptions: {},
      countries: [],
      defaultCountry: {}
    }
  }


  computeState() {
    let xValues = ['2017-01-01','2017-01-08','2017-01-15'];
    let reduxStore = {
      graphs: {
        1: {
          title: 'DDOS-graph',
          dataToshow: ['t1','t2'],
          graphLayout: ['l1']
        }
      },
      entities: {
        data: [
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
        layouts: {
          l1: {
            title : 'Global DDOS potential',
            height: 600,
            xaxis: {
              title: '*This chart assumes an average 1 mbit/sec Internet connection for every IP address.',
              gridcolor: 'transparent',
            },
            yaxis: {
              title: 'GBit/sec'
            }
          }
        },
        countries: [
          {value: 'uk', label: 'United Kingdom' },
          {value: 'us', label: 'United States' },
          {value: 'ge', label: 'Georgia' },
        ]
      },
      defaultCountry: {value: 'uk', label: 'United Kingdom' }
    }

    let state = {
      data : reduxStore.entities.data,
      graphOptions: reduxStore.entities.layouts,
      countries: reduxStore.entities.countries,
      defaultCountry: reduxStore.defaultCountry
    }
    return state
  }


  componentDidMount() {
    this.setState(this.computeState())
  };


  render() {
    return (
      <div>
        <PlotlyGraph
          data={this.state.data}
          graphOptions={this.state.graphOptions}
          graphID='DDOS-graph' />
        < CountrySelect selectOptions={[this.state.defaultCountry]} />
        < CountrySelect selectOptions={[{value: 't', label: 'Total'}]} />
        < CountrySelect selectOptions={this.state.countries}/>
        < CountrySelect selectOptions={this.state.countries}/>
        < CountrySelect selectOptions={this.state.countries}/>
      </div>
    );
  }
}


export class CountrySelect extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let options = this.props.selectOptions
    const style = { width: "20%", display: "inline", float: "left" }
    return (
      <div style={style}>
        <Select
          name="countries"
          options={options}
        />
      </div>
    );
  }
}

// export default CountryPerformanceOnRisk;
