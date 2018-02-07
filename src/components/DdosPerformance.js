import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import PlotlyGraph from './Plot.js';
import {
  fetchDataIfNeeded
} from '../actions/cubeActions';
// import notes from `../stats-new/api/annotations/publicAnnotation.json`;
//front page graph
export class DdosPerformance extends Component {
  constructor(props) {
    super(props)
    let annotation_dates = [];
    let annotation_notes = [];
    let annotations = [];
    fetch(`/static/scripts/publicAnnotation.json`)
      .then((response) => {
        return response.json()
      })
      .then((annFilterByCountry) => {
        for (var ann_num in annFilterByCountry.notes) {
          if (annFilterByCountry.notes[ann_num].country_code == 999) {
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
      });


    this.state = {
      graphOptions: {
        height: 600,
        xaxis: {
          gridcolor: 'transparent',
        },
        yaxis: {
          title: this.props.view.yLabel
        },
        barmode: 'stack',
        marker: {
          symbol: 'square'
        },
        annotations: [{
            xref: 'paper',
            yref: 'paper',
            x: 1.056,
            xanchor: 'left',
            y: 0.99,
            yanchor: 'bottom',
            text: 'Risks',
            legendtitle: true,
            showarrow: false,
          },
          annotations: annotations
        ]
      },
      plotlyData: [],
      annotation_dates: annotation_dates,
      annotation_notes: annotation_notes
    }
  }


  computeState(props = this.props) {
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
      }).filter(value => {
        return value !== undefined
      })
      plotlyData.splice(1, 0, {
        //x: ['2016-01-01', '2016-05-30', '2017-05-05'],
        x: this.state.annotation_dates,
        y: this.state.annotation_dates.map(function(x) {
          return 0
        }),
        //y: [0, 0, 0],
        mode: 'markers',
        marker: {
          symbol: 'circle',
          color: 'rgba(252, 159, 91, .8)',
          size: 8,
        },
        legendgroup: ['group1','group2','group3','group4','group5'],
        traceorder: 'grouped',
        name: 'Annotations',
        hovermode: 'y',
        hoverlabel: {
          bgcolor: '#FC9F5B',
          bordercolor: '#000000'
        },
        hoverinfo: 'text',
        text: this.state.annotation_notes,
      });
      state['plotlyData'] = plotlyData
    }

    return state
  }

  convertToPlotlySeries(countryID, risk, cubeByRiskByCountry, measure, color) {
    var dataTable = cubeByRiskByCountry[risk.id][countryID];
    if (dataTable) {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => (row[measure] || row.count) / 1000000),
        name: risk.title,
        type: 'bar',
        traceorder: 'grouped',
        legendgroup: ['group1','group2','group3','group4','group5'],
        marker: {
          color: color
        }
      }
    }
  }


  componentDidMount() {
    this.props.view.risksToView.forEach(risk => {
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
    return ( <
      div >
      <
      PlotlyGraph data = {
        this.state.plotlyData
      }
      graphOptions = {
        this.state.graphOptions
      }
      graphID = {
        this.props.view.id
      }
      /> < /
      div >
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
