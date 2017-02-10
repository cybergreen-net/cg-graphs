import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import Highlighter from 'react-highlight-words'
import 'react-select/dist/react-select.css';
import { countryIsSelected, fetchDataIfNeeded } from '../actions/cubeActions';


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
          return this.convertToPlotlySeries(
            config.country,
            props.view.risk,
            props.cubeByRiskByCountry,
            props.view.measure
          )
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


  convertToPlotlySeries(countryID, riskID, cubeByRiskByCountry, measure) {
    var dataTable = cubeByRiskByCountry[riskID][countryID];
    return {
      x: dataTable.map(row => row.date),
      y: dataTable.map(row => row[measure] || row.count),
      name: this.props.countries[countryID].name,
      type: 'scatter',
    }
  }


  componentDidMount() {
    this.props.dispatch(fetchDataIfNeeded(
      this.props.view.country,
      this.props.view.risk,
      this.props.viewId
    ))
    this.props.dispatch(fetchDataIfNeeded(
      't',
      this.props.view.risk,
      this.props.viewId
    ))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {
    if(!selectedCountry || selectedCountry.value === "") {
      this.props.dispatch(countryIsSelected(idxOfSelector, "", this.props.viewId))
    } else {
      this.props.dispatch(countryIsSelected(
        idxOfSelector,
        selectedCountry.value,
        this.props.viewId
      ))
      this.props.dispatch(fetchDataIfNeeded(
        selectedCountry.value,
        this.props.view.risk,
        this.props.viewId
      ))
    }
  }


  render() {
    let self = this
    let style = {margin:"40px"}
    return (
      <div style={style}>
        <h2>
          {this.props.risks[this.props.view.risk].title.toUpperCase()} &nbsp; | &nbsp;
          {this.props.countries[this.props.view.country].name.toUpperCase()}
        </h2>
        <PlotlyGraph
          data={this.state.plotlyData}
          graphOptions={this.state.graphOptions}
          graphID={this.props.viewId} />
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
    this.state= {
      inputValue: ''
    }
  }

  optionRenderer(option) {
    if(!option.label){ return }
    return (
      <Highlighter
        searchWords={[this.state.inputValue]}
        textToHighlight={option.label}
      />
    );
  }


  setInputValue(value) {
    this.setState({
      inputValue: value
    })
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
          onInputChange={this.setInputValue.bind(this)}
          optionRenderer={this.optionRenderer.bind(this)}
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
    risks: state.entities.risks,
    graphOptions: state.entities.layouts
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
