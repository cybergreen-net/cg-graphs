/* global GLOSSARYPAGE */
import React, {
  Component
} from 'react';
import update from 'react/lib/update'
import {
  connect
} from 'react-redux';
import PlotlyGraph from './Plot.js';
import numeral from 'numeral';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
  riskAndDateAreSelected,
  fetchData
} from '../actions/ChoroplethMapActions';


export class ChoroplethMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphID: 'ChoroplethMap',
      data: [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: [],
        z: [],
        text: [],
        hoverinfo: 'text',
        autocolorscale: false,
        colorbar: {
          thickness: 5,
          len: 0.5
        },
        colorscale: [
          [0.0, 'rgba(122, 184, 0, 0.7)'],
          ['0.111111111111', 'rgba(147, 189, 12, 0.7)'],
          ['0.222222222222', 'rgba(172, 194, 25, 0.7)'],
          ['0.333333333333', 'rgba(197, 199, 38, 0.7)'],
          ['0.444444444444', 'rgba(223, 204, 51, 0.7)'],
          ['0.555555555556', 'rgba(238, 186, 53, 0.7)'],
          ['0.666666666667', 'rgba(242, 140, 40, 0.7)'],
          ['0.777777777778', 'rgba(246, 95, 27, 0.7)'],
          ['0.888888888889', 'rgba(250, 49, 14, 0.7)'],
          [1.0, 'rgba(250, 0, 0, 0.7)']
        ]
      }],
      layout: {
        height: 600,
        geo: {
          showcountries: true,
          showframe: false,
          showcoastlines: false,
          projection: {
            type: 'robinson'
          }
        },
        margin: {
          t: 0,
          l: 0,
          b: 0,
          r: 0
        }
      }
    }

    this.handleChangeRisk = this.handleChange.bind(this, 'riskToShow')
    this.handleChangeDate = this.handleChange.bind(this, 'dateToShow')
  }


  handleChange(idx, object) {
    if (idx === 'riskToShow') {
      this.props.dispatch(fetchData(
        object.value,
        this.props.view.date
      ))
      this.props.dispatch(riskAndDateAreSelected(
        object.value,
        this.props.view.date
      ))
    } else if (idx === 'dateToShow') {
      this.props.dispatch(fetchData(
        this.props.view.risk,
        object.value
      ))
      this.props.dispatch(riskAndDateAreSelected(
        this.props.view.risk,
        object.value
      ))
    }
  }


  computeState(props = this.props) {
    let locations = []
    let counts = []
    let hoverInfo = []
    let text;
    if (props.view.risk === 100) {
      text = props.view.unit + ' DDOS Potential'
    } else {
      text = 'Count of ' + props.risks[props.view.risk].taxonomy + ' devices'
    }
    if (!props.view.isFetching && props.view.isFetched) {
      props.data[props.view.risk][props.view.date].forEach(entry => {
        if (props.countries[entry.country]) {
          locations.push(props.countries[entry.country].name)
          counts.push(entry[props.view.measure] / props.view.unitDevider)
          hoverInfo.push(numeral(entry[props.view.measure] / props.view.unitDevider).format('0,0') + ' | ' + text + ' in ' + entry.country)
        }
      })

      let max = Math.max(...counts)
      let z = counts.map(item => {
        return (100 * (Math.log(Math.ceil(item)) / Math.log(max)))
      })

      return update(this.state, {
        data: [{
          locations: {
            $set: locations
          },
          z: {
            $set: z
          },
          text: {
            $set: hoverInfo
          }
        }]
      })
    }

    return {}
  }


  componentDidMount() {
    this.props.dispatch(fetchData(this.props.view.risk, this.props.view.date))
  }


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  render() {
    const riskSelectOptions = Object.values(this.props.risks).map(risk => {
      return {
        value: risk.id,
        label: risk.title
      }
    })
    return ( <
      div >
      <
      PlotlyGraph data = {
        this.state.data
      }
      graphOptions = {
        this.state.layout
      }
      graphID = {
        this.state.graphID
      }
      /> <
      div >
      Level of risk posed to others on selected risk on a scale from 0 - 100(100 = worst).For more on data sources, calculations and terms see <
      a href = {
        GLOSSARYPAGE
      } > Glossary and data page < /a> <
      /div> <
      div className = "row" >
      <
      div className = "col-sm-2 col-sm-offset-5"
      title = "Select a risk" >
      <
      Select value = {
        this.props.view.risk
      }
      name = 'riskToShow'
      onChange = {
        this.handleChangeRisk
      }
      clearable = {
        false
      }
      options = {
        riskSelectOptions
      }
      /> <
      /div> <
      /div>

      <
      /div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    view: state.ChoroplethMapViews,
    data: state.entities.cubeByRiskByDate,
    countries: state.entities.countries,
    risks: state.entities.risks
  }
}


export default connect(mapStateToProps)(ChoroplethMap);
