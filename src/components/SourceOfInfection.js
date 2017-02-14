import React, { Component } from 'react';
//import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
// import Select from 'react-select';
// import Highlighter from 'react-highlight-words'
// import 'react-select/dist/react-select.css';
// import { fetchDataIfNeeded } from '../actions/cubeActions';


export class SourceOfInfection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphOptions: { barmode: 'stack' },
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let plotlyData = []
    props.view.AS.id.forEach(AsId => {
      let trace = this.convertToPlotlySeries(props.data, AsId)
      plotlyData.push(trace)
    })
    plotlyData.push(this.convertToPlotlySeries(props.data, undefined, true))

    return {plotlyData: plotlyData}
  }


  convertToPlotlySeries(dataTable, AsId, allTheRest=false) {
    if(allTheRest) {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => {
          let sum = row.as.reduce((total, asn) => {
            return total + asn.count
          }, 0)
          return (row.count - sum)
        }),
        name: "All the rest",
        type: 'bar'
      }
    } else {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => {
          let asn = row.as.filter(asn => asn.id === AsId)
          return asn[0].count
        }),
        name: AsId,
        type: 'bar'
      }
    }
  }


  componentDidMount() {
    // this.props.view.as.id.forEach(AsId => {
    //   this.props.dispatch(fetchAsData(this.props.view.country, this.props.view.risk, AsId))
    // })
    this.setState(this.computeState(this.props))
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
          graphID={this.props.viewId} />
      </div>
    );
  }
}
