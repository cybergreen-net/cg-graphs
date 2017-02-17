import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import Highlighter from 'react-highlight-words';
import 'react-select/dist/react-select.css';
import '../css/temp.css' //this is temp import - needs to be removed for bundle

import { fetchAsDataIfNeeded, AsIsSelected } from '../actions/ASactions';

export class ASPerformance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      plotlyData: [],
      graphOptions: {
        legend: {x:0, y:1},
        height: 200,
        margin: {
          l: 30,r: 30,
          b: 30,t: 0
        },
        font: {
          size: 9,
          color: '#7f7f7f'
        }
      }
    }
  }


  computeState(props=this.props) {
    let lineColors = [
      'rgb(214, 39, 40)', 'rgb(31, 119, 180)', 'rgb(44, 160, 44)',
      'rgb(255, 127, 14)', 'rgb(238, 130, 238)'
    ]
    let plotlyData
    if(props.view.isFetched) {
      plotlyData = props.view.selectorConfig.map(config => {
        if (config.as){
          return this.convertToPlotlySeries(
            config.as,
            props.view.country,
            props.view.risk,
            props.data
          )
        }
      }).filter(value => {return value !== undefined})
      plotlyData.forEach((trace, idx) => {
        trace['line'] = {color: lineColors[idx]}
      })
    }

    return {
      plotlyData: plotlyData
    }
  }


  convertToPlotlySeries(asID, countryID, riskID, data) {
    var dataTable = data[countryID+'/'+riskID+'/'+asID];
    return {
      x: dataTable.map(row => row.date),
      y: dataTable.map(row => row.count),
      name: this.props.asn[asID].name,
      type: 'scatter',
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
    if(!selectedAS || selectedAS.value === "") {
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
    return (
      <div className="graph-div">
        <h3>
          {this.props.risks[this.props.view.risk].title.toUpperCase()} &nbsp; | &nbsp;
          {this.props.countries[this.props.view.country].name.toUpperCase()}
        </h3>
        <PlotlyGraph
          data={this.state.plotlyData}
          graphOptions={this.state.graphOptions}
          graphID={this.props.viewId} />
        {this.props.view.selectorConfig.map((selectInfo, idx) => {
          return <ASSelect
                    asn={Object.values(this.props.asn)}
                    disabled={selectInfo.disabled}
                    onChange={this.updateValue.bind(this, idx)}
                    selectedAS={selectInfo.as}
                    key={idx}
                    />
        })}
      </div>
    );
  }
}

export class ASSelect extends Component {
  constructor(props) {
    super(props)
    this.state= {
      inputValue: ''
    }
  }

  optionRenderer(option) {
    if(!option.label){ return }
    return (
      <Highlighter
        searchWords={[this.state.inputValue]}
        textToHighlight={option.label}
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
        value: asn.id,
        label: asn.name
      }
    })
    selectOptions.unshift({value: '', label: 'Select an ASN'})
    return (
      <div className="Select-div">
        <Select
          name="asn"
          value={this.props.selectedAS || selectOptions[0]}
          options={selectOptions}
          onChange={this.props.onChange}
          onInputChange={this.setInputValue.bind(this)}
          optionRenderer={this.optionRenderer.bind(this)}
          disabled={this.props.disabled}
          clearable={false}
        />
      </div>
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
