import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlotlyGraph from './Plot.js';
import { fetchDataIfNeeded } from '../actions/cubeActions';

export class DdosPerformance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphOptions: {
        height: 600,
        xaxis: {
         title: '*This chart assumes an average 1 mbit/sec Internet connection for every IP address.',
         gridcolor: 'transparent',
        },
        yaxis: {
         title: 'GBit/sec'
        },
        barmode: 'stack'
      },
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let state = {}
    let plotlyData = []
    let barColors = [
      'rgb(175, 12, 22)', 'rgb(255, 106, 0)',
      'rgb(34, 148, 26)', 'rgb(22, 96, 167)'
    ]

    if (props.view.isFetched) {
      plotlyData = props.view.risksToView.map((risk, idx) => {
        return this.convertToPlotlySeries(
          props.view.country,
          risk,
          props.data,
          props.view.measure,
          barColors[idx]
        )
      }).filter(value => {return value !== undefined})

      state['plotlyData'] = plotlyData
    }

    return state
  }


  convertToPlotlySeries(countryID, risk, cubeByRiskByCountry, measure, color) {
    var dataTable = cubeByRiskByCountry[risk.id][countryID];
    if(dataTable) {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => (row[measure] || row.count )/ 1000000),
        name: risk.title,
        type: 'bar',
        marker: {color: color}
      }
    }
  }


  componentDidMount() {
    this.props.view.risksToView.forEach(risk =>{
      this.props.dispatch(fetchDataIfNeeded(
        this.props.view.country,
        risk.id,
        this.props.view.id,
        'DdosPerformanceViews'
      ))
    })
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  render() {
    return (
      <div>
        <PlotlyGraph
          data={this.state.plotlyData}
          graphOptions={this.state.graphOptions}
          graphID={this.props.view.id}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    view: state.DdosPerformanceViews['global/ddos'],
    data: state.entities.cubeByRiskByCountry
  }
}


export default connect(mapStateToProps)(DdosPerformance);
