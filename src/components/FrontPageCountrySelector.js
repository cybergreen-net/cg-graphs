import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class FrontPageCountrySelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCountry: undefined
    }
  }

  onChange(country) {
    // purely for testing atm - we don't use state internally
    this.setState({
      selectedCountry: country
    });
    if (country.slug) {
      window.location = `/country/${country.slug}`
    }
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
        />
      </div>
    );
  }
}
