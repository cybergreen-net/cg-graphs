import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


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
    let countries = []
    if (props.countries) {
      countries = Object.keys(props.countries).map(countryID => {
        return {
          value: countryID.toLowerCase(),
          label: props.countries[countryID].title
        }
      })
    }

    let plotlyData = []
    if (props.cubeByRiskByCountry) {
      plotlyData = props.views[1].selectorConfig.map(config => {
        if (config.country){
          return this.convertToPlotlySeries(config.country, 1, props.cubeByRiskByCountry)
        }
      }).filter(value => {return value !== undefined})
    }

    let state = {
      cubeByRiskByCountry: props.cubeByRiskByCountry,
      graphOptions: props.graphOptions,
      countries: countries,
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
      name: this.props.countries[countryID].title,
      type: 'scatter',
    }
  }


  componentDidMount() {
    this.setState(this.computeState(this.props))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {
    selectedCountry = selectedCountry || { value: "" }
    this.props.dispatch(this.countryIsSelected(idxOfSelector, selectedCountry.value))
  }


  countryIsSelected(idxOfSelector, selectedCountry) {
    return {
      type: 'SELECT',
      idxOfSelector,
      selectedCountry
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
                    selectOptions={this.state.countries}
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
    views: state.views
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
