/* global GLOSSARYPAGE */
import React, { Component } from 'react';
import update from 'react/lib/update'
import { connect } from 'react-redux';
import PlotlyGraph from './Plot.js';
import numeral from'numeral';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { fetchDataIfNeeded, riskAndDateAreSelected } from '../actions/ChoroplethMapActions';


export class ChoroplethMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphID: 'ChoroplethMap',
      data: [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: [],
        z: [],
        text: [],
        hoverinfo: 'text',
        autocolorscale: false,
        colorbar: {
          thickness: 5,
          len: 0.5
        },
        colorscale: [
          [0, 'rgb(231, 251, 245)'],
          [1, 'rgb(255, 0, 0)']
        ]
      }],
      layout: {
        height: 600,
        geo: {
          showcountries: true,
          showframe: false,
          showcoastlines: false,
          projection:{
            type: 'equirectangular'
          }
        },
        margin: { t: 0, l: 0, b: 0, r: 0 }
      }
    }

    this.handleChangeRisk = this.handleChange.bind(this, 'riskToShow')
    this.handleChangeDate = this.handleChange.bind(this, 'dateToShow')
  }


  handleChange(idx, object) {
    if(idx === 'riskToShow') {
      this.props.dispatch(fetchDataIfNeeded(
        object.value,
        this.props.view.date
      ))
      this.props.dispatch(riskAndDateAreSelected(
        object.value,
        this.props.view.date
      ))
    } else if (idx === 'dateToShow') {
      this.props.dispatch(fetchDataIfNeeded(
        this.props.view.risk,
        object.value
      ))
      this.props.dispatch(riskAndDateAreSelected(
        this.props.view.risk,
        object.value
      ))
    }
  }


  computeState(props=this.props) {
    let locations = []
    let counts = []
    let hoverInfo = []
    if(!props.view.isFetching && props.view.isFetched) {
      props.data[props.view.risk][props.view.date].forEach(entry => {
        if(props.countries[entry.country]) {
          locations.push(props.countries[entry.country].name)
          counts.push(entry.count)
          hoverInfo.push(numeral(entry.count_amplified).format('0,0') + ' ' +props.countries[entry.country].name + ' | ' +entry.country)
        }
      })

      let max = Math.max(...counts)
      let z = counts.map(item => {
        return ( 100 * ( Math.log(item) / Math.log(max) ) )
      })

      return update(this.state, {
        data: [{
          locations: {$set: locations},
          z: {$set: z},
          text: {$set: hoverInfo}
        }]
      })
    }

    return {}
  }


  componentDidMount() {
    this.props.dispatch(fetchDataIfNeeded(this.props.view.risk, this.props.view.date))
  }


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  render() {
    const riskSelectOptions = Object.values(this.props.risks).map(risk => {
      return {
        value: risk.id,
        label: risk.title
      }
    })
    return (
      <div>
        <PlotlyGraph
          data={this.state.data}
          graphOptions={this.state.layout}
          graphID={this.state.graphID}/>
        <div>
          Level of risk posed to others on selected risk on a scale from 0-100
          (100=worst). For more on data sources, calculations and terms see
          <a href={GLOSSARYPAGE}>Glossary and data page</a>
        </div>
        <div className="row">
          <div className="col-sm-2 col-sm-offset-4" title="Select a date">
            <Select
              value={this.props.view.date}
              name='dateToShow'
              onChange={this.handleChangeDate}
              clearable={false}
              options={[{value: this.props.view.date, label: this.props.view.date}]}/>
          </div>
          <div className="col-sm-2" title="Select a risk">
            <Select
              value={this.props.view.risk}
              name='riskToShow'
              onChange={this.handleChangeRisk}
              clearable={false}
              options={riskSelectOptions}/>
          </div>
        </div>

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    view: state.ChoroplethMapViews,
    data: state.entities.cubeByRiskByDate,
    countries: state.entities.countries,
    risks: state.entities.risks
  }
}


export default connect(mapStateToProps)(ChoroplethMap);
