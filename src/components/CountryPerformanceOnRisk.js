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
      defaultCountry: {},
      selected1: undefined,
      selected2: undefined,
      selected3: undefined
    }
    this.updateValue1 = this.updateValue1.bind(this)
    this.updateValue2 = this.updateValue2.bind(this)
    this.updateValue3 = this.updateValue3.bind(this)
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
          {value: '', label: 'Select a country'},
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


  updateValue1(newCountry) {

    this.setState({
      selected1: newCountry
    })
  }

  updateValue2(newCountry) {
    this.setState({
      selected2: newCountry
    })
  }

  updateValue3(newCountry) {
    this.setState({
      selected3: newCountry
    })
  }


  render() {
    return (
      <div>
        <PlotlyGraph
          data={this.state.data}
          graphOptions={this.state.graphOptions}
          graphID='DDOS-graph' />
        < CountrySelect
          selectOptions={[this.state.defaultCountry]}
          disabled={true}
        />
        < CountrySelect
          selectOptions={[{value: 't', label: 'Total'}]}
          disabled={true}
        />
        < CountrySelect
          selectOptions={this.state.countries}
          onchange={this.updateValue1}
          selectedCountries={this.state.selected1}
        />
        < CountrySelect
          selectOptions={this.state.countries}
          onchange={this.updateValue2}
          selectedCountries={this.state.selected2}
        />
        < CountrySelect
          selectOptions={this.state.countries}
          onchange={this.updateValue3}
          selectedCountries={this.state.selected3}
        />
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
    let update = this.props.onchange
    let selectedCountries = this.props.selectedCountries
    let disabled = this.props.disabled
    const style = { width: "20%", display: "inline", float: "left" }
    return (
      <div style={style}>
        <Select
          name="countries"
          value={selectedCountries || options[0]}
          options={options}
          onChange={update}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default CountryPerformanceOnRisk;
