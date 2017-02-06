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


  computeState(props=this.props) {

    let state = {
      data: props.data,
      graphOptions: props.graphOptions,
      countries: props.countries,
      defaultCountry: props.defaultCountry,
    }
    return state
  }


  componentDidMount() {
    this.setState(this.computeState(this.props))
  };

  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }

  updateValue1(newCountry) {
    if (newCountry) {
      this.props.dispatch({type: "addRemoveLine", id: newCountry.value + '1', idx: 2})
    } else {
      this.props.dispatch({type: "addRemoveLine", id: newCountry, idx: 2})
    }
    this.setState({
      selected1: newCountry

    })
  }

  updateValue2(newCountry) {
    if (newCountry) {
      this.props.dispatch({type: "addRemoveLine", id: newCountry.value + '1', idx: 3})
    } else {
      this.props.dispatch({type: "addRemoveLine", id: newCountry, idx: 3})
    }
    this.setState({
      selected2: newCountry
    })
  }

  updateValue3(newCountry) {
    if (newCountry) {
      this.props.dispatch({type: "addRemoveLine", id: newCountry.value + '1', idx: 4})
    } else {
      this.props.dispatch({type: "addRemoveLine", id: newCountry, idx: 4})
    }
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
          onChange={this.updateValue1}
          selectedCountries={this.state.selected1}
        />
        < CountrySelect
          selectOptions={this.state.countries}
          onChange={this.updateValue2}
          selectedCountries={this.state.selected2}
        />
        < CountrySelect
          selectOptions={this.state.countries}
          onChange={this.updateValue3}
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
    let update = this.props.onChange
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
    data: state.entities.data.filter(data => {
      return state.graphs[1].dataToshow.indexOf(data.id) !== -1
    }),
    graphOptions: state.entities.layouts,
    countries: state.entities.countries,
    defaultCountry: state.defaultCountry
  }
}

export default connect(mapStateToProps)(CountryPerformanceOnRisk)
