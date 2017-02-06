import React, { Component } from 'react';
import { connect } from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countrySelectors: [
        {selectOptions: props.countries, disabled: true, selected: props.defaultCountry},
        {selectOptions: props.countries, disabled: true, selected: {value: 't', label: 'Global'}},
        {selectOptions: props.countries, disabled: false, selected: undefined},
        {selectOptions: props.countries, disabled: false, selected: undefined},
        {selectOptions: props.countries, disabled: false, selected: undefined}
      ],
      data: [],
      graphOptions: {},
      countries: [],
      defaultCountry: {}
    }
  }


  computeState(props=this.props) {
    let state = {
      data: props.data,
      graphOptions: props.graphOptions,
      countries: props.countries,
      defaultCountry: props.defaultCountry
     }
    return state
  }


  componentDidMount() {
    this.setState(this.computeState(this.props))
  };


  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps))
  }


  updateValue(idxOfSelector, selectedCountry) {
    if (selectedCountry) {
      this.props.dispatch({type: "addRemoveLine", id: selectedCountry.value + '1', idx: idxOfSelector})
    } else {
      this.props.dispatch({type: "addRemoveLine", id: selectedCountry, idx: idxOfSelector})
    }

    this.setState({
      countrySelectors: Object.assign(
        [],
        this.state.countrySelectors,
        this.state.countrySelectors.slice()[idxOfSelector].selected  = selectedCountry
      )
    })
  }


  render() {
    let self = this
    return (
      <div>
        <PlotlyGraph
          data={this.state.data}
          graphOptions={this.state.graphOptions}
          graphID='DDOS-graph' />
        {this.state.countrySelectors.map((selectInfo, idx) => {
          return <CountrySelect
                    selectOptions={selectInfo.selectOptions}
                    disabled={selectInfo.disabled}
                    onChange={self.updateValue.bind(self, idx)}
                    selectedCountry={selectInfo.selected}
                    key={idx}
                    />
        })}
      </div>
    );
  }
}


export class CountrySelect extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const style = { width: "20%", display: "inline", float: "left" }
    return (
      <div style={style}>
        <Select
          name="countries"
          value={this.props.selectedCountry || this.props.selectOptions[0]}
          options={this.props.selectOptions}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    data: state.entities.data.filter(data => {
      return state.graphs[1].dataToshow.indexOf(data.id) !== -1
    }),
    graphOptions: state.entities.layouts,
    countries: state.entities.countries,
    defaultCountry: state.defaultCountry
  }
}


export default connect(mapStateToProps)(CountryPerformanceOnRisk)
