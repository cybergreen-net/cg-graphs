import React, { Component } from 'react';
import update from 'react/lib/update'
import { connect } from 'react-redux';
import PlotlyGraph from './Plot.js';
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
        autocolorscale: false,
        colorbar: {
          thickness: 10,
          x: 0.8
        },
        zmin: 0,
        zmax: 8200000,
        colorscale: [
          [0, 'rgb(231, 251, 245)'],
          [0.2, 'rgb(162, 239, 218)'],
          [0.4, 'rgb(115, 231, 199)'],
          [0.6, 'rgb(46, 219, 172)'],
          [0.8, 'rgb(0, 212, 154)'],
          [1, 'rgb(0, 174, 127)']
        ]
      }],
      layout: {
        height: 500,
        title: 'Choropleth Map',
        geo: {
          showcountries: true,
          projection: {
              type: 'equirectangular'
          }
        }
      },
      dateToShow: this.props.view.date,
      riskToShow: this.props.view.risk
    }

    this.handleChangeRisk = this.handleChange.bind(this, 'riskToShow')
    this.handleChangeDate = this.handleChange.bind(this, 'dateToShow')
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleChange(idx, object) {
    this.setState({
      [idx]: object.value
    })
  }


  handleSubmit(event) {
    event.preventDefault()
    this.props.dispatch(fetchDataIfNeeded(
      this.state.riskToShow,
      this.state.dateToShow
    ))
    this.props.dispatch(riskAndDateAreSelected(
      this.state.riskToShow,
      this.state.dateToShow
    ))
  }


  computeState(props=this.props) {
    let locations = []
    let z = []
    if(!props.view.isFetching && props.view.isFetched) {
      props.data[props.view.risk][props.view.date].forEach(entry => {
        if(props.countries[entry.country]) {
          locations.push(props.countries[entry.country].name)
          z.push(entry.count)
        }
      })

      return update(this.state, {
        data: [{
          locations: {$set: locations},
          z: {$set: z}
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
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-sm-2 col-sm-offset-4">
              <Select
                value={this.state.dateToShow}
                name='dateToShow'
                onChange={this.handleChangeDate}
                clearable={false}
                options={[{value: this.state.dateToShow, label: this.state.dateToShow}]}/>
            </div>
            <div className="col-sm-2">
              <Select
                value={this.state.riskToShow}
                name='riskToShow'
                onChange={this.handleChangeRisk}
                clearable={false}
                options={riskSelectOptions}/>
            </div>
            <div className="col-sm-1">
              <input type="submit" value="Submit" className="btn btn-primary" />
            </div>
          </div>
        </form>
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
