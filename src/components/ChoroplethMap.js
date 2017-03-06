import React, { Component } from 'react';
import update from 'react/lib/update'
import { connect } from 'react-redux';
import PlotlyGraph from './Plot.js';
import { fetchDataIfNeeded } from '../actions/ChoroplethMapActions';


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
        autocolorscale: true
      }],
      layout: {
        title: 'Choropleth Map',
        geo: {
          projection: {
              type: 'robinson'
          }
        }
      }
    }
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
          z: {$set: z},
          text: {$set: z}
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
    return (
      <div>
        <PlotlyGraph
          data={this.state.data}
          graphOptions={this.state.layout}
          graphID={this.state.graphID}/>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    view: state.ChoroplethMapViews,
    data: state.entities.cubeByRiskByDate,
    countries: state.entities.countries
  }
}


export default connect(mapStateToProps)(ChoroplethMap);
