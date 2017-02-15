import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
// import Select from 'react-select';
// import Highlighter from 'react-highlight-words'
// import 'react-select/dist/react-select.css';
// import { fetchDataIfNeeded } from '../actions/cubeActions';


export class SourceOfInfection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphOptions: {
        barmode: 'stack',
        hovermode:'closest',
        height: 234,
        margin: {
          l: 30,r: 30,
          b: 30,t: 0
        },
        xaxis: {
          gridcolor: 'transparent',
          tickformat: '%Y'
        },
        font: {
          size: 9,
          color: '#7f7f7f'
        }
      },
      plotlyData: []
    }
  }


  computeState(props=this.props) {
    let plotlyData = []
    props.view.AS.id.forEach(AsId => {
      let trace = this.convertToPlotlySeries(
        props.data[props.view.risk][props.view.country],
        AsId
      )
      plotlyData.push(trace)
    })
    plotlyData.push(this.convertToPlotlySeries(
      props.data[props.view.risk][props.view.country],
      undefined,
      true
    ))

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
        <h3>
          {this.props.risks[this.props.view.risk].title.toUpperCase()}
          &nbsp; | &nbsp; ASN SOURCE
        </h3>
        <PlotlyGraph
          data={this.state.plotlyData}
          graphOptions={this.state.graphOptions}
          graphID={this.props.viewId}
          clickable={true} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //when API is done we'll need to replace 'cubeByRiskByAS' with 'cubeByRiskByCountry'
    data: state.entities.cubeByRiskByAS,
    risks: state.entities.risks
  }
}

export default connect(mapStateToProps)(SourceOfInfection)
