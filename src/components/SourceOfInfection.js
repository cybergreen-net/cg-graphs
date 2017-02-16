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
    props.data[props.view.risk][props.view.country].forEach(dataEntry => {
      let colorPallet = [
        'rgb(122,71,239)',
        'rgb(167,133,243)', 'rgb(199,179,249)', 'rgb(173,246,250)',
        'rgb(124,244,251)', 'rgb(41,232,251)', 'rgb(212,229,250)',
        'rgb(169,205,250)', 'rgb(140,181,253)', 'rgb(20,105,234)'
      ]
      dataEntry.as.forEach((asn, idx) => {
        let trace = this.plotlySeries(dataEntry, asn)
        trace['marker'] = {
          color: colorPallet[idx]
        }
        plotlyData.push(trace)
      })

    })

    return {plotlyData: plotlyData}
  }
  

  plotlySeries(data, asn){
    return {
      x: [data.date],
      y: [asn.count],
      type: 'bar',
      name: asn.id
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
