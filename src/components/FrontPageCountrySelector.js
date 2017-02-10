import React, { Component } from 'react';
import Highlighter from 'react-highlight-words'
import Select from 'react-select';
import Loader from 'halogen/BounceLoader'
import 'react-select/dist/react-select.css';

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
    this.setState({
      selectedCountry: country,
      spinner: '40px'
    });
    if (country.slug) {
      window.location = `/country/${country.slug}`
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
    const selectOptions = Object.values(this.props.countries).map(country => {
      return {
        value: country.id,
        label: country.name,
        slug: country.slug
      }
    })

    selectOptions.unshift({value: '', label: 'Select a country'})
    return (
      <div>
        <Select
          name="country-selector"
          value={this.state.selectedCountry || selectOptions[0]}
          options={selectOptions}
          onChange={this.onChange.bind(this)}
          onInputChange={this.setInputValue.bind(this)}
          optionRenderer={this.optionRenderer.bind(this)}
        />
        <Loader size={this.state.spinner} />
      </div>
    );
  }
}
