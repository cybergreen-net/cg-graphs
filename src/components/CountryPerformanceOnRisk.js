import React, { Component } from 'react';
import { connect } from 'react-redux'
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

    let state = {
      data: this.props.data,
      graphOptions: this.props.graphOptions,
      countries: this.props.countries,
      defaultCountry: this.props.defaultCountry,
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

const mapStateToProps = (state) => {
  return {
    data : state.entities.data,
    graphOptions: state.entities.layouts,
    countries: state.entities.countries,
    defaultCountry: state.defaultCountry
  }
}

export default connect(mapStateToProps)(CountryPerformanceOnRisk)
