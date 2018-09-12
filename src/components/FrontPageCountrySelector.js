import React, {
  Component
} from 'react';
import Highlighter from 'react-highlight-words'
import Select from 'react-select';
import { BounceLoader } from 'halogenium';


export default class FrontPageCountrySelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCountry: undefined,
      inputValue: '',
      spinner: '0px'
    }
  }


  onChange(country) {
    // purely for testing atm - we don't use state internally
    if (country && country.constructor !== Array) {
      this.setState({
        selectedCountry: country
      });
      if (country !== null && country.value !== '') {
        this.setState({
          spinner: '40px'
        })
        window.location = `/country/${country.slug}`
      }
    } else if (country === null) {
      this.setState({
        selectedASN: country
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

  render() {
    const selectOptions = Object.values(this.props.countries).map(country => {
      return {
        value: country.id,
        label: country.name,
        slug: country.slug
      }
    })
    let spinnerStyle = {
      padding: '20px',
      margin: 'auto',
      width: '10%'
    }
    selectOptions.unshift({
      value: '',
      label: 'Select a country'
    })
    return ( <
      div >
      <
      Select name = "country-selector"
      value = {
        this.state.selectedCountry || selectOptions[0]
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
      div style = {
        spinnerStyle
      } >
      <
      BounceLoader size = {
        this.state.spinner
      }
      color = '#00D49A' / >
      <
      /div> <
      /div>
    );
  }
}
