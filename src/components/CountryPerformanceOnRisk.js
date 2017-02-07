import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectorConfig: [
        {disabled: true, country: 'gb'},
        {disabled: true, country: 't'},
        {disabled: false, country: undefined},
        {disabled: false, country: undefined},
        {disabled: false, country: undefined}
      ],
      graphOptions: {},
      defaultCountry: {}
    }
  }


  computeState(props=this.props) {
    let state = {
      cubeByRiskByCountry: props.cubeByRiskByCountry,
      graphOptions: props.graphOptions,
      defaultCountry: props.defaultCountry,
      countries: props.countries
     }
    return state
  }


  componentDidMount() {
    this.setState(this.computeState(this.props))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {

    let cloneSelectorConfig = this.state.selectorConfig.slice()
    cloneSelectorConfig[idxOfSelector].country = undefined
    if (selectedCountry) {
      cloneSelectorConfig[idxOfSelector].country = selectedCountry.value
    }

    this.setState({
      selectorConfig: Object.assign(
        [],
        this.state.selectorConfig,
        cloneSelectorConfig
      )
    })
  }


  makePlotlyData(countryID, riskID, cubeByRiskByCountry) {
    var dataTable = cubeByRiskByCountry[riskID][countryID];
    return {
      x: dataTable.map(row => row.date),
      y: dataTable.map(row => row.count),
      name: this.state.countries[countryID].title,
      type: 'scatter',
    }
  }


  render() {
    let self = this
    let plotlyData = []
    let countries = []
    if (this.state.cubeByRiskByCountry) {
      plotlyData = this.state.selectorConfig.map(config => {
        if (config.country){
          return this.makePlotlyData(config.country, 1, self.state.cubeByRiskByCountry)
        }
      }).filter(value => {return value !== undefined})
    }
    if (this.state.countries) {
      countries = Object.keys(this.state.countries).map(countryID => {
        return {
          value: countryID.toLowerCase(),
          label: this.state.countries[countryID].title
        }
      })
    }

    return (
      <div>
        <PlotlyGraph
          data={plotlyData}
          graphOptions={this.state.graphOptions}
          graphID='DDOS-graph' />
        {this.state.selectorConfig.map((selectInfo, idx) => {
          return <CountrySelect
                    selectOptions={countries}
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
    return (
      <div style={style}>
        <Select
          name="countries"
          value={this.props.selectedCountry || this.props.selectOptions[0]}
          options={this.props.selectOptions}
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
    defaultCountry: state.defaultCountry
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
