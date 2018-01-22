import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux'
import PlotlyGraph from './Plot.js';
import update from 'react/lib/update'
// import notes from `../stats-new/api/annotations/publicAnnotation.json`;

export class SourceOfInfection extends Component {
  constructor(props) {
    super(props)
    let annotation_dates = [];
    let annotation_notes = [];
    let annotations = [];
    fetch(`../api/annotations/publicAnnotation.json`)
      .then((response) => {
        return response.json()
      })
      .then((annFilterByCountry) => {
          for (var ann_num in annFilterByCountry.notes) {
            if (annFilterByCountry.notes[ann_num].country_code == props.view.country && annFilterByCountry.notes[ann_num].risk_id == props.view.risk) {
              annotation_dates.push(annFilterByCountry.notes[ann_num].annotation_date);
              annotation_notes.push(annFilterByCountry.notes[ann_num].annotation_date + '\n' + annFilterByCountry.notes[ann_num].annotation);
              annotations.push({
                type: 'date',
                x: annFilterByCountry.notes[ann_num].annotation_date,
                y: 0,
                xref: 'x',
                yref: 'y',
                align: 'middle',
                valign: 'center',
                text: '',
                borderwidth: 0,
                showarrow: true,
                arrowsize: 0,
                arrowwidth: 1,
                arrowcolor: '#FC9F5B',
                arrowhead: 6,
                opacity: 0.8,
                ax: 0,
                ay: -200,
              });
            }
            if (annFilterByCountry.notes[ann_num].country_code == 999 && annFilterByCountry.notes[ann_num].risk_id == props.view.risk) {
              annotation_dates.push(annFilterByCountry.notes[ann_num].annotation_date);
              annotation_notes.push(annFilterByCountry.notes[ann_num].annotation_date + '\n' + annFilterByCountry.notes[ann_num].annotation);
              annotations.push({
                type: 'date',
                x: annFilterByCountry.notes[ann_num].annotation_date,
                y: 0,
                xref: 'x',
                yref: 'y',
                align: 'middle',
                valign: 'center',
                text: '',
                borderwidth: 0,
                showarrow: true,
                arrowsize: 0,
                arrowwidth: 1,
                arrowcolor: '#FC9F5B',
                arrowhead: 6,
                opacity: 0.8,
                ax: 0,
                ay: -200,
              });
            }
          }
        }
      );



    this.state = {
      graphOptions: {
        barmode: 'stack',
        hovermode: 'closest',
        showlegend: false,
        height: 252,
        margin: {
          l: 40,
          r: 30,
          b: 30,
          t: 0
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
        },
        showlegend: false,
        annotations: annotations,
      },
      annotation_dates: annotation_dates,
      annotation_notes: annotation_notes,
      plotlyData: []
    }
  }


  computeState(props = this.props) {
    let plotlyData = []

    props.data[props.view.risk][props.view.country].forEach(dataEntry => {
      let colorPallet = [
        'rgb(96, 3, 212)', 'rgb(84, 114, 222)', 'rgb(169, 244, 252)',
        'rgb(7, 101, 240)', 'rgb(0, 212, 154)'
      ]
      let countAllRest = parseInt(dataEntry[props.view.measure]) / props.view.unitDevider
      dataEntry.as.forEach((asn, idx) => {
        countAllRest -= parseInt(asn[props.view.measure]) / props.view.unitDevider
        let trace = this.plotlySeries(dataEntry, asn, props.view.measure, props.view.unitDevider)
        trace['marker'] = {
          color: colorPallet[idx]
        }
        plotlyData.push(trace)
      })
      // needs to be fixed does not work
      plotlyData.push({
        //x: ['2016-01-01', '2016-05-30', '2017-05-05'],
        x: this.state.annotation_dates,
        y: this.state.annotation_dates.map(function(x) {
          return 0
        }),
        //y: [0, 0, 0],
        mode: 'markers',
        marker: {
          color: 'rgba(252, 159, 91, .8)',
          size: 8,
          name: 'Annotation'
        },
        hovermode: 'y',
        hoverlabel: {
          bgcolor: '#FC9F5B',
          bordercolor: '#000000'
        },
        hoverinfo: 'text',
        text: this.state.annotation_notes,
      });

      let traceAllRest = {
        x: [dataEntry.date],
        y: [countAllRest],
        type: 'bar',
        name: 'Rest',
        marker: {
          color: 'rgb(200, 2, 16)'
        },
        text: ['Rest'],
        hoverinfo: 'x+y+text'
      }
      plotlyData.unshift(traceAllRest)
    })
    let state = {
      plotlyData: plotlyData
    }
    if (props.view.unit && props.view.risk === 100 && props.view.normMeasure !== 'count_normalized') {
      state.graphOptions = update(this.state.graphOptions, {
        yaxis: {
          title: {
            $set: props.view.unit
          }
        }
      });
    }
    return state
  }


  plotlySeries(data, asn, measure, unitDevider) {
    var title = this.props.asns[asn.id] ? this.props.asns[asn.id].title : 'Unknown'
    return {
      x: [data.date],
      y: [asn[measure] / unitDevider],
      type: 'bar',
      name: asn.id,
      text: [asn.id + ' | ' + title],
      hoverinfo: 'x+y+text'
    }
  }


  componentDidMount() {
    if (this.props.data[this.props.view.risk] && this.props.data[this.props.view.risk][this.props.view.country]) {
      this.setState(this.computeState(this.props))
    }
  };


  componentWillReceiveProps(nextProps) {
    if (nextProps.data[this.props.view.risk] && nextProps.data[this.props.view.risk][this.props.view.country]) {
      this.setState(this.computeState(nextProps))
    }
  }


  render() {
    return ( <
      div >
      <
      h3 > {
        this.props.risks[this.props.view.risk].title.toUpperCase()
      } {` `} | {` `} AS SOURCE <
      /h3> <
      PlotlyGraph data = {
        this.state.plotlyData
      }
      graphOptions = {
        this.state.graphOptions
      }
      graphID = {
        this.props.viewId
      }
      clickable = {
        true
      }
      /> <
      /div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.entities.cubeByRiskByCountry,
    risks: state.entities.risks,
    asns: state.entities.asn
  }
}

export default connect(mapStateToProps)(SourceOfInfection)
