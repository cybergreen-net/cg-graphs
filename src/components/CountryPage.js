import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import CountryPerformanceOnRisk from './CountryPerformanceOnRisk';
import SourceOfInfection from './SourceOfInfection';
import '../css/temp.css' //this is temp import - needs to be removed for bundle

import Highlighter from 'react-highlight-words'
import Select from 'react-select';
import { PulseLoader } from 'halogenium';
import 'react-select/dist/react-select.css';


export class CountryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedASN: undefined,
      inputValue: ''
    }
  }


  onChange(asn) {
    if (asn && asn.constructor !== Array) {
      this.setState({
        selectedASN: asn
      });
      if (asn !== null && asn.value !== '') {
        window.open(`asn/${asn.value}`, '_blank')
      }
    } else if (asn === null) {
      this.setState({
        selectedASN: asn
      });
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


  download(data) {
    if (data === 'country') {
      let country = Object.values(this.props.views)[0].country
      window.location = `/api/v1/count_by_country?limit=500&country=${country}&format=csv`
    } else {
      window.location = `/download`
    }
  }


  render() {
    const selectOptions = Object.values(this.props.asn).map(asn => {
      return {
        value: asn.number,
        label: asn.number + ' | ' + asn.title
      }
    })
    selectOptions.unshift({
      value: '',
      label: 'View any Autonomous System in this country'
    })
    let spinner = Object.values(this.props.views).find(view => {
      return view.isFetching
    })
    return ( <
      div > {
        spinner ? < Loader size = '100px'
        color = '#00D49A'
        className = 'spinner' / > : ''
      } <
      div className = "row" >
      <
      div className = "col-md-6" > < /div> <
      div className = "col-md-6" >
      <
      Select name = "asn-selector"
      value = {
        this.state.selectedASN || selectOptions[0]
      }
      options = {
        selectOptions
      }
      onChange = {
        this.onChange.bind(this)
      }
      onInputChange = {
        this.setInputValue.bind(this)
      }
      optionRenderer = {
        this.optionRenderer.bind(this)
      }
      /> <
      /div> <
      /div> {
        Object.values(this.props.views).map(view => {
          return ( <
            div key = {
              view.id + 1
            }
            className = "row" >
            <
            div className = "col-md-6 panel panel-default" >
            <
            CountryPerformanceOnRisk view = {
              view
            }
            viewId = {
              view.id
            }
            /> <
            /div> <
            div className = "col-md-6 panel panel-default" >
            <
            SourceOfInfection view = {
              view
            }
            viewId = {
              'SOI/' + view.id
            }
            /> <
            /div> <
            /div>
          )
        })
      } <
      button type = 'button'
      className = 'btn btn-primary-black btn-lg'
      onClick = {
        this.download.bind(this, 'country')
      } >
      Download Data in CSV <
      /button> <
      button type = 'button'
      className = 'btn btn-primary-black btn-lg'
      style = {
        {
          float: 'right'
        }
      }
      onClick = {
        this.download.bind(this, 'as')
      } >
      Get AS data on the Download page <
      /button> <
      /div>
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
