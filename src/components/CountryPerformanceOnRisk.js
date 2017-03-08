import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import update from 'react/lib/update'
import Highlighter from 'react-highlight-words'
import 'react-select/dist/react-select.css';
import {
  countryIsSelected, fetchDataIfNeeded,
  getCountryRanking , changeMeasure
} from '../actions/cubeActions';


export class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cubeByRiskByCountry: {},
      graphOptions: {
        legend: {x:0, y:1},
        height: 200,
        margin: {
          l: 40,r: 30,
          b: 30,t: 0
        },
        xaxis: {
          gridcolor: 'transparent',
        },
        yaxis: {
          title: 'Count of infected devices'
        },
        font: {
          size: 9,
          color: '#7f7f7f'
        }
      },
      countries: {},
      selectorConfig: [],
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let state = {
      cubeByRiskByCountry: props.cubeByRiskByCountry,
      selectorConfig: props.view.selectorConfig
    }

    let plotlyData = []
    let lineColors = [
      'rgb(214, 39, 40)', 'rgb(31, 119, 180)', 'rgb(44, 160, 44)',
      'rgb(255, 127, 14)', 'rgb(238, 130, 238)'
    ]
    if (props.view.isFetching === 0) {
        plotlyData = props.view.selectorConfig.map(config => {
        if (config.country){
          return this.convertToPlotlySeries(
            config.country,
            props.view.risk,
            props.cubeByRiskByCountry,
            props.view.measure
          )
        }
        return {}
      }).filter(value => {return value !== undefined})
      plotlyData.forEach((trace, idx) => {
        trace['line'] = {color: lineColors[idx]}
      })
      state['plotlyData'] = plotlyData
    }

    return state
  }


  convertToPlotlySeries(countryID, riskID, cubeByRiskByCountry, measure) {
    var dataTable = cubeByRiskByCountry[riskID][countryID];
    if(dataTable) {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => row[measure] || row.count),
        name: this.props.countries[countryID].name,
        type: 'scatter',
      }
    }
  }


  componentDidMount() {
    this.props.dispatch(fetchDataIfNeeded(
      this.props.view.country,
      this.props.view.risk,
      this.props.viewId
    ))
    this.props.dispatch(getCountryRanking(
      this.props.view.country,
      this.props.view.risk,
      this.props.viewId
    ))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {
    if(selectedCountry.constructor !== Array) {
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
  }


  buttonChange(changeEvent) {
    switch (changeEvent.target.value) {
      case 'count_normalized':
        var newState = update(this.state, {
          graphOptions: {
            yaxis: {
              title: { $set: 'Trend' }
            }
          }
        });
        this.setState(newState);
        break;
      default:
        var newState = update(this.state, {
          graphOptions: {
            yaxis: {
              title: { $set: 'Count of infected devices' }
            }
          }
        });
        this.setState(newState);

    }
    this.props.dispatch(changeMeasure(
      changeEvent.target.value,
      this.props.viewId
    ))
  }

  render() {
    return (
      <div className="graph-div">
        <form>
           <label className="radio-inline">
             <input type="radio" value="count"
               checked={this.props.view.measure === 'count'}
               onChange={this.buttonChange.bind(this)}
             />
             Simple counts
           </label>
           <label className="radio-inline">
             <input type="radio" value="count_normalized"
               checked={this.props.view.measure === 'count_normalized'}
               onChange={this.buttonChange.bind(this)}
             />
             Trend
           </label>
        </form>
        <div className="row">
          <div className="col-sm-11">
            <h3>
              {this.props.risks[this.props.view.risk].title.toUpperCase()} &nbsp; | &nbsp;
              {this.props.countries[this.props.view.country].name.toUpperCase()}
            </h3>
          </div>
          <div className="col-sm-1">
            { this.props.view.rank ? <a href="/country" title="Rank of country on this risk in last month with #1 = worst"><h3 className="pull-right">#{this.props.view.rank}</h3></a> : '' }
          </div>
        </div>
        <PlotlyGraph
          data={this.state.plotlyData}
          graphOptions={this.state.graphOptions}
          graphID={this.props.viewId} />
        {this.state.selectorConfig.map((selectInfo, idx) => {
          return <CountrySelect
                    countries={Object.values(this.props.countries)}
                    disabled={selectInfo.disabled}
                    onChange={this.updateValue.bind(this, idx)}
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
    const selectOptions = this.props.countries.map(country => {
      return {
        value: country.id,
        label: country.name
      }
    })
    selectOptions.unshift({value: '', label: 'Select a country'})
    return (
      <div className="Select-div">
        <Select
          name="countries"
          value={this.props.selectedCountry || selectOptions[0]}
          options={selectOptions}
          onChange={this.props.onChange}
          onInputChange={this.setInputValue.bind(this)}
          optionRenderer={this.optionRenderer.bind(this)}
          disabled={this.props.disabled}
          clearable={false}
        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    cubeByRiskByCountry: state.entities.cubeByRiskByCountry,
    countries: state.entities.countries,
    risks: state.entities.risks
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
