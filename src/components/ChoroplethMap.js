import React, { Component } from 'react';
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
