import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { countryIsSelected, setViews, fetchDataIfNeeded } from '../actions/cubeActions';


export class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cubeByRiskByCountry: {},
      graphOptions: {},
      countries: {},
      selectorConfig: [],
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let plotlyData = []
    if (props.view.isFetched) {
      plotlyData = props.view.selectorConfig.map(config => {
        if (config.country){
          return this.convertToPlotlySeries(config.country, 1, props.cubeByRiskByCountry)
        }
      }).filter(value => {return value !== undefined})
    }
    let state = {
      cubeByRiskByCountry: props.cubeByRiskByCountry,
      graphOptions: props.graphOptions,
      plotlyData: plotlyData,
      selectorConfig: props.view.selectorConfig
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
    this.props.dispatch(fetchDataIfNeeded(
      this.props.view.country,
      this.props.view.risk
    ))
    this.props.dispatch(fetchDataIfNeeded(
      't',
      this.props.view.risk
    ))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {
    if(!selectedCountry || selectedCountry.value === "") {
      this.props.dispatch(countryIsSelected(idxOfSelector, ""))
    } else {
      this.props.dispatch(countryIsSelected(idxOfSelector, selectedCountry.value))
      this.props.dispatch(fetchDataIfNeeded(selectedCountry.value, this.props.view.risk))
    }
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


const mapStateToProps = (state, ownProps) => {
  return {
    cubeByRiskByCountry: state.entities.cubeByRiskByCountry,
    countries: state.entities.countries,
    graphOptions: state.entities.layouts,
    view: state.countryPerformanceOnRiskViews[ownProps.view.id]
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
