import React, { Component } from 'react';
import { connect } from 'react-redux';
import CountryPerformanceOnRisk from './CountryPerformanceOnRisk';
import SourceOfInfection from './SourceOfInfection';
import '../css/temp.css' //this is temp import - needs to be removed for bundle

import Highlighter from 'react-highlight-words'
import Select from 'react-select';
import Loader from 'halogen/BounceLoader'
import 'react-select/dist/react-select.css';


export class CountryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedASN: undefined,
      inputValue: '',
      spinner: '0px'
    }
  }


  onChange(asn) {
    this.setState({
      selectedASN: asn,
      spinner: '100px'
    });
    if (asn.value) {
      window.location = `/asn/${asn.value}`
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
    const selectOptions = Object.values(this.props.asn).map(asn => {
      return {
        value: asn.number,
        label: asn.title
      }
    })
    let spinnerStyle = { padding:'20px', margin: 'auto', width:'10%'}
    selectOptions.unshift({value: '', label: 'Select an AS'})
    let spinner = Object.values(this.props.views).find(view => {
      return view.isFetching
    })
    return (
      <div>
        { spinner ? <Loader size='100px' color='#00D49A' className='spinner'/> : '' }
        <Loader size={this.state.spinner} color='#00D49A' className='spinner'/>
        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <Select
              name="asn-selector"
              value={this.state.selectedASN || selectOptions[0]}
              options={selectOptions}
              onChange={this.onChange.bind(this)}
              onInputChange={this.setInputValue.bind(this)}
              optionRenderer={this.optionRenderer.bind(this)}
            />
          </div>
        </div>
        {Object.values(this.props.views).map(view => {
          return (
            <div key={view.id} className="row">
              <div className="col-md-6 panel panel-default">
                <CountryPerformanceOnRisk view={view} viewId={view.id}/>
              </div>
              <div className="col-md-6 panel panel-default">
                <SourceOfInfection view={view} viewId={'SOI/'+view.id}/>
              </div>
            </div>
          )
        })}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    views: state.countryPerformanceOnRiskViews,
    asn: state.entities.asn
  }
}


export default connect(mapStateToProps)(CountryPage)
