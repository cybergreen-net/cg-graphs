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
         gridcolor: 'transparent',
        },
        yaxis: {
         title: 'GBit/sec'
        },
        barmode: 'stack',
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 1.056,
          xanchor: 'left',
          y: 0.99,
          yanchor: 'bottom',
          text: 'Risks',
          legendtitle: true,
          showarrow: false
        }]
      },
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let state = {}
    let plotlyData = []
    let barColors = [
      'rgb(200, 2, 16)', 'rgb(0, 212, 154)',
      'rgb(84, 114, 222)', 'rgb(96, 3, 212)'
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
