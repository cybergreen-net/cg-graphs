import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';


export class SourceOfInfection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphOptions: {
        barmode: 'stack',
        hovermode:'closest',
        showlegend: false,
        height: 252,
        margin: {
          l: 40,r: 30,
          b: 30,t: 0
        },
        xaxis: {
          gridcolor: 'transparent',
          tickformat: '%Y-%m-%d'
        },
        yaxis: {
          title: this.props.view.yLabel
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

    props.data[props.view.risk][props.view.country].forEach(dataEntry => {
      let colorPallet = [
        'rgb(96, 3, 212)', 'rgb(84, 114, 222)', 'rgb(169, 244, 252)',
        'rgb(7, 101, 240)', 'rgb(0, 212, 154)'
      ]
      let countAllRest = parseInt(dataEntry.count)
      dataEntry.as.forEach((asn, idx) => {
        countAllRest -= parseInt(asn.count)
        let trace = this.plotlySeries(dataEntry, asn)
        trace['marker'] = {
          color: colorPallet[idx]
        }
        plotlyData.push(trace)
      })
      let traceAllRest = {
        x: [dataEntry.date],
        y: [countAllRest],
        type: 'bar',
        name: 'Rest',
        marker: {color: 'rgb(200, 2, 16)'},
        text: ['Rest'],
        hoverinfo: 'x+y+text'
      }
      plotlyData.unshift(traceAllRest)
    })

    return {plotlyData: plotlyData}
  }


  plotlySeries(data, asn){
    return {
      x: [data.date],
      y: [asn.count],
      type: 'bar',
      name: asn.id,
      text: [asn.id],
      hoverinfo: 'x+y+text'
    }
  }


  componentDidMount() {
    if(this.props.data[this.props.view.risk] && this.props.data[this.props.view.risk][this.props.view.country]) {
      this.setState(this.computeState(this.props))
    }
  };


  componentWillReceiveProps(nextProps) {
    if(nextProps.data[this.props.view.risk] && nextProps.data[this.props.view.risk][this.props.view.country]) {
      this.setState(this.computeState(nextProps))
    }
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
    data: state.entities.cubeByRiskByCountry,
    risks: state.entities.risks
  }
}

export default connect(mapStateToProps)(SourceOfInfection)
