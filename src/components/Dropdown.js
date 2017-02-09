import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios'

export default class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedCountry: undefined }
  }

  onChange(country) {
    this.setState({
      selectedCountry: country
    });
    if (country.slug) {
      window.location = `https://cybergreen-staging.herokuapp.com/country/${country.slug}`
    }
  }

  render() {
    const style = { width: "50%", margin: "auto" }
    const selectOptions = Object.values(this.props.countries).map(country => {
      return {
        value: country.id,
        label: country.name,
        slug: country.slug
      }
    })

    selectOptions.unshift({value: '', label: 'Select a country'})
    return (
      <div style={style}>
        <Select
          name="jump to a country page"
          value={this.state.selectedCountry || selectOptions[0]}
          options={selectOptions}
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}
