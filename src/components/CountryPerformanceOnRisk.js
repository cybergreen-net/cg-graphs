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
    let annotation_dates = [];
    let annotation_notes = [];
    let annotations = [];
    fetch(`/static/scripts/publicAnnotation.json`)
    .then( (response) => {
        return response.json()
    })
    .then( (annData) => {
      console.log (annData);
        for (var ann_num in annData.notes){
          console.log(props.view);
          if (annData.notes[ann_num].risk_id == props.view.risk){
              console.log(ann_num);
              console.log(annData.notes[ann_num].annotation_date);
              annotation_dates.push(annData.notes[ann_num].annotation_date);
              annotation_notes.push(annData.notes[ann_num].annotation_date + '\n' + annData.notes[ann_num].annotation);
              annotations.push ({
                type: 'date',
                x: annData.notes[ann_num].annotation_date,
                y:0,
                xref: 'x',
                yref: 'y',
                align: 'middle',
                valign: 'center',
                text: '',
                borderwidth: 0,
                showarrow: true,
                arrowsize:0,
                arrowwidth: 1,
                arrowcolor: '#FC9F5B',
                arrowhead: 6,
                opacity: 0.8,
                ax: 0,
                ay:-200,
              });
            }
        }
    });

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
          title: this.props.view.yLabel
        },
        font: {
          size: 9,
          color: '#7f7f7f'
        },
        showlegend: false,
        annotations: annotations,
      },
      annotation_dates: annotation_dates,
      annotation_notes: annotation_notes,
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
          // unit = this.getUnitAndDevider(props.cubeByRiskByCountry[props.view.risk][config.country], props.view.risk)
          return this.convertToPlotlySeries(
            config.country,
            props.view.risk,
            props.cubeByRiskByCountry,
            props.view.measure,
            props.view.normMeasure,
            props.view.unitDevider,
            //props.view.annotations //added here to test if props loads inside map
          )
        }
        return {}
      }).filter(value => {return value !== undefined})
      plotlyData.forEach((trace, idx) => {
        trace['line'] = {color: lineColors[idx]}
      })
      plotlyData.splice(1, 0, {
        //x: ['2016-01-01', '2016-05-30', '2017-05-05'],
        x: this.state.annotation_dates,
        y: this.state.annotation_dates.map(function (x){ return 0}),
        //y: [0, 0, 0],
        mode: 'markers',
        marker: {
          color: 'rgba(252, 159, 91, .8)', size: 8,
          font:{color:'#FBD1A2'},
          name: 'Annotation',
        },
        hoverlabel:{
          bgcolor: '#FC9F5B',
          bordercolor: '#FBD1A2'
        },
        hoverinfo:'text',
        text: this.state.annotation_notes,
      });

      /* Write up more console logs to pinpoint where data is created */
      console.log('plotlyData view', props.view.annotations)
      console.log('plotlyData', plotlyData)
      state['plotlyData'] = plotlyData //.push(props.view.annotations) //push overrides the x values of the graph
      console.log('state plotlyData', state['plotlyData'])
    }
    if (props.view.unit && props.view.risk === 100 && props.view.normMeasure !== 'count_normalized') {
      state.graphOptions = update(this.state.graphOptions, {
        yaxis: {
          title: { $set: props.view.unit }
        }
      });
    }
    return state
  }


  convertToPlotlySeries(countryID, riskID, cubeByRiskByCountry, measure, normMeasure, devider) {
    var dataTable = cubeByRiskByCountry[riskID][countryID];
    if(dataTable) {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => row[normMeasure]/devider || row[measure]/devider),
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
              title: { $set: this.props.view.yLabel }
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
        <div className="row">
          <div className="col-sm-11">
            <h3>
              {this.props.risks[this.props.view.risk].title.toUpperCase()} &nbsp; | &nbsp;
              {this.props.countries[this.props.view.country].name.toUpperCase()}
            </h3>
          </div>
          <div className="col-sm-1">
            { this.props.view.rank ? <a href="/country" title="Rank of country on this risk in last week with #1 = worst"><h3 className="pull-right graph-rank">#{this.props.view.rank}</h3></a> : '' }
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
        <form className="radio-form">
           <label className="radio-inline">
             <input type="radio" value={this.props.view.measure}
               checked={this.props.view.normMeasure !== 'count_normalized'}
               onChange={this.buttonChange.bind(this)}
             />
             Simple counts
           </label>
           <label className="radio-inline">
             <input type="radio" value="count_normalized"
               checked={this.props.view.normMeasure === 'count_normalized'}
               onChange={this.buttonChange.bind(this)}
             />
             Trend
           </label>
        </form>
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
