import FrontPageCountrySelector from '../src/components/FrontPageCountrySelector';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('FrontPageCountrySelector component is working fine', () => {
  function setup() {
    let props = {
      countries: {
        't': {id: 't', name: 'Global', slug: ''},
        'ge': {id: 'ge', name: 'Georgia', slug: 'georgia'},
        'kz': {id: 'kz', name: 'Kazakhstan', slug: 'Kazakhstan'},
        'gb': {id: 'gb', name: 'United Kingdom', slug: 'united-kingdom'},
        'us': {id: 'us', name: 'United States', slug: 'united-states'}
      }
    }
    const enzymeWrapper = shallow(< FrontPageCountrySelector {...props} />)

    return {
      props,
      enzymeWrapper
    }
  }

  it('Renders expected DOM', () => {
    const { enzymeWrapper } = setup()
    expect(toJson(enzymeWrapper)).toMatchSnapshot();
  })

  it('When a country is selected, it updates state of the component', () => {
    const { enzymeWrapper, props } = setup()
    let newCountry = {value: 'us', label: 'United States', slug: 'united-states'}
    expect(enzymeWrapper.state().selectedCountry).toEqual(undefined)
    enzymeWrapper.find('Select').simulate('change', newCountry)
    expect(enzymeWrapper.state().selectedCountry).toEqual(newCountry)
  })

})
