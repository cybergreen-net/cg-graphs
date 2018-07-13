import React, {
  Component
}
from 'react';
import {
  connect
}
from 'react-redux';
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import Highlighter from 'react-highlight-words';
import 'react-select/dist/react-select.css';
import '../css/temp.css' //this is temp import - needs to be removed for bundle

import {
  fetchAsDataIfNeeded,
  AsIsSelected
}
from '../actions/ASactions';
// import notes from `../stats-new/api/annotations/publicAnnotation.json`;

function roundDateStringToMonday(d) {
  /*
  Given a date string of form "yyyy-MM-dd", return another date string
  in "yyyy-MM-dd" representing the Monday of that same week.

  For example:
  If "2018-07-09" is a Monday, this also returns "2017-07-09".
  If "2018-07-10" is a Tuesday, this returns "2017-07-09".
  If "2018-07-12" is a Thursday, again return "2017-07-09"
  */
  d = new Date(d);
  let day = d.getDay(),
      diff = d.getDate() - day + 1 + (day == 0 ? -6:1); // adjust when day is sunday
  let round_date = new Date(d.setDate(diff));
  return (round_date.getUTCFullYear() +"-"+ (round_date.getUTCMonth()+1) +"-"+ round_date.getUTCDate());
}

function alignDates(dt_in){
  /*
  Given a list of data points from the CG country API, round dates to the Monday of that week,
  and merge counts for data points belonging to same week.

  e.g. dt_in:

  [
    {risk: 1, count: 2354, count_amplified: 124210, date: "2018-07-11",...},
    {risk: 1, count: 23, count_amplified: 342, date: "2018-07-12",...},
    {risk: 1, count: 2543, count_amplified: 145320, date: "2018-07-03",...},
    {risk: 1, count: 15, count_amplified: 231, date: "2018-07-04",...},
    ...
  ]

  returns:
  [
    {risk: 1, count: 2377, count_amplified: 124552, date: "2018-07-09",...},
    {risk: 1, count: 2557, count_amplified: 145551, date: "2018-07-02",...},
  ]
  */
  let dt = JSON.parse(JSON.stringify(dt_in));
  let alignedDt = [];

  for (var i = 0; i < dt.length; i++){
    dt[i].date  = roundDateStringToMonday(dt[i].date);
    dt[i].count = Number(dt[i].count);
    dt[i].count_amplified = Number(dt[i].count_amplified);

    if (alignedDt.length > 0){
      if (dt[i].date == alignedDt[alignedDt.length - 1].date && dt[i].risk == alignedDt[alignedDt.length - 1].risk){
        alignedDt[alignedDt.length - 1].count += dt[i].count;
        alignedDt[alignedDt.length - 1].count_amplified += dt[i].count_amplified;
      }
      else{
        alignedDt.push(dt[i]);
      }
    }
    else{
        alignedDt.push(dt[i]);
    }
  }
  return alignedDt;
}


export class ASPerformance extends Component {
  constructor(props) {
    super(props)
     // Start of code for fetching and filtering annotations
    let annotation_dates = [];
    let annotation_notes = [];
    let annotations = [];
    let aligned_dataTable = [];
    fetch(`/static/scripts/publicAnnotation.json`)
         .then((response) => {
             return response.json()
         })
       .then((annFilterByAsn) => {
        for (var ann_num in annFilterByAsn.notes) {
          if (annFilterByAsn.notes[ann_num].asn == props.view.asn) {
            annotation_dates.push(annFilterByAsn.notes[ann_num].annotation_date);
            annotation_notes.push(annFilterByAsn.notes[ann_num].annotation_date +
              '\n' + annFilterByAsn.notes[ann_num].annotation);
            annotations.push({
              type: 'date',
             });
           }
           if (annFilterByAsn.notes[ann_num].country_code == 999 &&
            annFilterByAsn.notes[ann_num].risk_id == props.view.risk) {
            annotation_dates.push(annFilterByAsn.notes[ann_num].annotation_date);
            annotation_notes.push(annFilterByAsn.notes[ann_num].annotation_date +
              '\n' + annFilterByAsn.notes[ann_num].annotation);
            annotations.push({
                type: 'date',
              });
            }
          }
        });
         // End of code for fetching and filtering annotations


    this.state = {
      plotlyData: [],
      graphOptions: {

        legend: {
          x: 100,
          y: 1,
          traceorder: 'grouped'
        },
        height: 300,
        margin: {
          l: 40,
          r: 30,
          b: 30,
          t: 0
        },
        spikedistance: -1,
        scene: {
            xaxis: {
                showspikes: true
            },
            yaxis: {
                showspikes: false,
            },
        },
        xaxis: {
            gridcolor: 'transparent',
            tickformat: '%d %b %Y',
            spikemode: 'across',
            spikedash: 'dash',
            spikesnap: 'data',
            spikethickness: 1,
            rangemode: 'nonnegative',
            rangemode: 'tozero',
            autorange: true
        },
        yaxis: {
            title: this.props.view.yLabel,
            rangemode: 'nonnegative',
            rangemode: 'tozero',
            autorange: true
        },
        font: {
            size: 9,
            color: '#7f7f7f'
        },
        hovermode: 'closest',
        showlegend: true,
        zeroline: true,
      },
      annotation_dates: annotation_dates,
      annotation_notes: annotation_notes,
    }
  }


// adjusts the colour  fix if needed
  computeState(props = this.props) {
    let lineColors = [
      '#11d48b', '#115ad4', '#d4115a',
      '#d48b11', '#8800d4'
    ]
    if (props.view.isFetched) {
      let plotlyData = props.view.selectorConfig.map(config => {
        if (config.as) {
          return this.convertToPlotlySeries(
            config.as,
            props.view.country,
            props.view.risk,
            props.data
          )
        }
        return {}
      }).filter(value => {
        return value !== undefined
      })
      plotlyData.forEach((trace, idx) => {
          trace.line = {
            color: lineColors[idx]
          }
        })
      // Start of annotations are added
      plotlyData.splice(6, 0, {
        // type: 'scatter',
        mode: 'markers',
        x: this.state.annotation_dates,
        y: this.state.annotation_dates.map(function(x) {
            return 0
        }),
        marker: {
            symbol: 'triangle-up',
            color: '#FFA500',
            size: 16,
            // opacity: 0.5

        },
        legendgroup: 'Annotations',
        name: 'Annotations',
        hoveron: 'points',
        hoverinfo: 'text',
        // hoverlabel: { textposition: 'middle-left', },
        text: this.state.annotation_notes
      });
      // End of annotations are added
      return {
        plotlyData: plotlyData
      }
    }
    return {}
  }

  convertToPlotlySeries(asID, countryID, riskID, dataFromCube) {
    var label = countryID + '/' + riskID + '/' + asID;
    // serialise and deserialise as ghetto deep copy
    var dataTable = {};
    console.log("dataFromCuberisk" + riskID, JSON.stringify(dataFromCube[label]))
    dataTable[label] = JSON.parse(JSON.stringify(dataFromCube[label]));
    console.log("dataTablerisk" + riskID, JSON.stringify(dataTable))
    var dataTable_aligned = {};

    dataTable_aligned[label] = alignDates(dataTable[label]);
    console.log("dataTable_alignedrisk" + riskID, JSON.stringify(dataTable_aligned));

    if (dataTable_aligned[label].length) {
      return {
        // Traces are styled here
        x: dataTable_aligned[label].map(row => row.date),
        y: dataTable_aligned[label].map(row => row.count),
        name: this.props.asn[asID] ? this.props.asn[asID].title : 'Unknown',
        type: 'scatter',
        mode: 'lines+markers',
        legendgroup: this.props.asn[asID].name,
        marker: {
            line: { width: 0.5 }
        },
        line: {
            width: 1,
            smoothing: 0.8,
            shape: 'spline',
            opacity: 0.5
        },
        showlegend: true,
        connectgaps: false
      }
    }
  }


  componentDidMount() {
    this.props.dispatch(fetchAsDataIfNeeded(
      this.props.view.country,
      this.props.view.risk,
      this.props.view.as,
      this.props.viewId
    ))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedAS) {
    if (!selectedAS || selectedAS.value === "") {
      this.props.dispatch(AsIsSelected(idxOfSelector, "", this.props.viewId))
    } else {
      this.props.dispatch(AsIsSelected(
        idxOfSelector,
        selectedAS.value,
        this.props.viewId
      ))
      this.props.dispatch(fetchAsDataIfNeeded(
        this.props.view.country,
        this.props.view.risk,
        selectedAS.value,
        this.props.viewId
      ))
    }
  }


  render() {
    return ( <
        div className = "graph-div" >
        <
        h3 > {
          this.props.risks[this.props.view.risk].title.toUpperCase()
        } <
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
        /> {
        this.props.view.selectorConfig.map((selectInfo, idx) => {
          return <ASSelect
          asn = {
            Object.values(this.props.asn)
          }
          disabled = {
            selectInfo.disabled
          }
          onChange = {
            this.updateValue.bind(this, idx)
          }
          selectedAS = {
            selectInfo.as
          }
          key = {
            idx
          }
          />
        })
      } <
      /div>
  );
}
}

export class ASSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: ''
    }
  }

  optionRenderer(option) {
    if (!option.label) {
      return
    }
    return ( <
      Highlighter searchWords = {
        [this.state.inputValue]
      }
      textToHighlight = {
        option.label
      }
      />
    );
  }


  setInputValue(value) {
    this.setState({
      inputValue: value
    })
  }

  render() {
    const selectOptions = this.props.asn.map(asn => {
      return {
        value: asn.number,
        label: asn.number + ' | ' + asn.title
      }
    })
    selectOptions.unshift({
      value: '',
      label: 'Select an ASNa'
    })
    let selectedAS = parseInt(this.props.selectedAS)
    return ( <
      div className = "Select-div" >
      <
      Select name = "asn"
      value = {
        selectedAS || selectOptions[0]
      }
      options = {
        selectOptions
      }
      onChange = {
        this.props.onChange
      }
      onInputChange = {
        this.setInputValue.bind(this)
      }
      optionRenderer = {
        this.optionRenderer.bind(this)
      }
      disabled = {
        this.props.disabled
      }
      clearable = {
        false
      }
      /> < /
      div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.entities.cubeByRiskByASN,
    asn: state.entities.asn,
    risks: state.entities.risks,
    countries: state.entities.countries
  }
}

export default connect(mapStateToProps)(ASPerformance)
