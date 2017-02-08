import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { countryIsSelected, fetchData } from '../actions/cubeActions';


export class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cubeByRiskByCountry: {},
      graphOptions: {},
      defaultCountry: '',
      countries: {},
      selectorConfig: [],
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let plotlyData = []
    if (props.views[1].isFetched) {
      plotlyData = props.views[1].selectorConfig.map(config => {
        if (config.country){
          return this.convertToPlotlySeries(config.country, 1, props.cubeByRiskByCountry)
        }
      }).filter(value => {return value !== undefined})
    }

    let state = {
      cubeByRiskByCountry: props.cubeByRiskByCountry,
      graphOptions: props.graphOptions,
      plotlyData: plotlyData,
      defaultCountry: props.views[1].country,
      selectorConfig: props.views[1].selectorConfig
    }
    return state
  }


  convertToPlotlySeries(countryID, riskID, cubeByRiskByCountry) {
    var dataTable = cubeByRiskByCountry[riskID][countryID];
    return {
      x: dataTable.map(row => row.date),
      y: dataTable.map(row => row.count),
      name: this.props.countries[countryID].name,
      type: 'scatter',
    }
  }


  componentDidMount() {
    this.props.dispatch(fetchData(
      this.props.views[1].country,
      this.props.views[1].risk
    ))
    this.props.dispatch(fetchData(
      't',
      this.props.views[1].risk
    ))
    this.setState(this.computeState(this.props))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {
    selectedCountry = selectedCountry || { value: "" }
    this.props.dispatch(countryIsSelected(idxOfSelector, selectedCountry.value))
    this.props.dispatch(fetchData(selectedCountry.value,this.props.views[1].risk))
  }


  render() {
    let self = this
    return (
      <div>
        <PlotlyGraph
          data={this.state.plotlyData}
          graphOptions={this.state.graphOptions}
          graphID='DDOS-graph' />
        {this.state.selectorConfig.map((selectInfo, idx) => {
          return <CountrySelect
                    countries={Object.values(this.props.countries)}
                    disabled={selectInfo.disabled}
                    onChange={self.updateValue.bind(self, idx)}
                    selectedCountry={selectInfo.country}
                    key={idx}
                    />
        })}
      </div>
    );
  }
}


export class CountrySelect extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const style = { width: "20%", display: "inline", float: "left" }
    const selectOptions = this.props.countries.map(country => {
      return {
        value: country.id,
        label: country.name
      }
    })
    selectOptions.unshift({value: '', label: 'Select a country'})
    return (
      <div style={style}>
        <Select
          name="countries"
          value={this.props.selectedCountry || selectOptions[0]}
          options={selectOptions}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    cubeByRiskByCountry: state.entities.cubeByRiskByCountry,
    countries: state.entities.countries,
    graphOptions: state.entities.layouts,
    views: state.views
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
