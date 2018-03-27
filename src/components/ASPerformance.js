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

export class ASPerformance extends Component {
  constructor(props) {
    super(props)
      // let annotation_dates = [];
      // let annotation_notes = [];
      // let annotations = [];
      // fetch(`/static/scripts/publicAnnotation.json`)
      //   .then((response) => {
      //     return response.json()
      //   })
      //   .then((annFilterByAsn) => {
      //     for (var ann_num in annFilterByAsn.notes) {
      //       if (annFilterByAsn.notes[ann_num].asn == props.view.asn) {
      //         annotation_dates.push(annFilterByAsn.notes[ann_num].annotation_date);
      //         annotation_notes.push(annFilterByAsn.notes[ann_num].annotation_date + '\n' + annFilterByAsn.notes[ann_num].annotation);
      //         annotations.push({
      //           type: 'date',
      //           x: annFilterByAsn.notes[ann_num].annotation_date,
      //           y: 0,
      //           xref: 'x',
      //           yref: 'y',
      //           align: 'middle',
      //           valign: 'center',
      //           text: '',
      //           borderwidth: 0,
      //           showarrow: true,
      //           arrowsize: 0,
      //           arrowwidth: 1,
      //           arrowcolor: '#FC9F5B',
      //           arrowhead: 6,
      //           opacity: 0.8,
      //           ax: 0,
      //           ay: -200,
      //         });
      //       }
      //       if (annFilterByAsn.notes[ann_num].country_code == 999 && annFilterByAsn.notes[ann_num].risk_id == props.view.risk) {
      //         annotation_dates.push(annFilterByAsn.notes[ann_num].annotation_date);
      //         annotation_notes.push(annFilterByAsn.notes[ann_num].annotation_date + '\n' + annFilterByAsn.notes[ann_num].annotation);
      //         annotations.push({
      //           type: 'date',
      //           x: annFilterByAsn.notes[ann_num].annotation_date,
      //           y: 0,
      //           xref: 'x',
      //           yref: 'y',
      //           align: 'middle',
      //           valign: 'center',
      //           text: '',
      //           borderwidth: 0,
      //           showarrow: true,
      //           arrowsize: 0,
      //           arrowwidth: 1,
      //           arrowcolor: '#FC9F5B',
      //           arrowhead: 6,
      //           opacity: 0.8,
      //           ax: 0,
      //           ay: -200,
      //         });
      //       }
      //     }
      // });


    this.state = {
      plotlyData: [],
      graphOptions: {
        legend: {
          x: 0,
          y: 1
        },
        height: 300,
        margin: {
          l: 40,
          r: 30,
          b: 30,
          t: 0
        },
        yaxis: {
          title: this.props.view.yLabel
        },
        font: {
          size: 9,
          color: '#7f7f7f'
        },
        // annotations: annotations,
      },
      // annotation_dates: annotation_dates,
      // annotation_notes: annotation_notes,
    }
  }


// adjusts the colour  fix if needed
  computeState(props = this.props) {
    let lineColors = [
      '#00D499', '#116AD4', '#FF9C00',
      '#FF5C00', '#F60030'
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
        // plotlyData.splice(1, 0, {
        //   //x: ['2016-01-01', '2016-05-30', '2017-05-05'],
        //   x: this.state.annotation_dates,
        //   y: this.state.annotation_dates.map(function(x) {
        //     return 0
        //   }),
        //   //y: [0, 0, 0],
        //   mode: 'markers',
        //   marker: {
        //     color: 'rgba(252, 159, 91, .8)',
        //     size: 8,
        //     name: 'Annotation'
        //   },
        //   name: 'Annotations',
        //   hovermode: 'y',
        //   hoverlabel: {
        //     bgcolor: '#FC9F5B',
        //     bordercolor: '#000000'
        //   },
        //   hoverinfo: 'text',
        //   text: this.state.annotation_notes,
        // });
      return {
        plotlyData: plotlyData
      }
    }
    return {}
  }

  convertToPlotlySeries(asID, countryID, riskID, dataFromCube) {
    var dataTable = dataFromCube[countryID + '/' + riskID + '/' + asID];
    if (dataTable.length) {
      return {
        x: dataTable.map(row => row.date),
        y: dataTable.map(row => row.count),
        name: this.props.asn[asID] ? this.props.asn[asID].title : 'Unknown',
        type: 'scatter',
        mode: 'markers',
        marker: {
          line: {width: 0.5},
          size: 3,
          symbol: 'circle-dot'
        },
        // line: {
        //   width: 1,
        //   smoothing: 1,
        //   simplify: true,
        //   shape: 'spline'},
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
      label: 'Select an ASN'
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
