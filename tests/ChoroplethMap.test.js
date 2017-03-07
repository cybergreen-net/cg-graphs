import { ChoroplethMap } from '../src/components/ChoroplethMap';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

function setup() {
  let props = {
    dispatch: jest.fn(),
    data: {
      100: {
        '2017-01-01': [
          {country: 'GB', count: 123},
          {country: 'US', count: 324}
        ]
      }
    },
    countries: {
      'GB': {id: 'GB', name: 'United Kingdom', slug: 'united-kingdom'},
      'US': {id: 'US', name: 'United States', slug: 'united-states'}
    },
    risks: {
      1: {title: 'Open DNS', id: 1},
      2: {title: 'Open NTP', id: 2}
    },
    view: {
      isFetched: false,
      isFetching: false,
      didFailed: false,
      risk: 100,
      date: '2017-01-01'
    }
  }

  const enzymeWrapper = shallow(<ChoroplethMap {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('ChoroplethMap component', () => {
  it('render PlotlyGraph component with expected props', () => {
    const { enzymeWrapper } = setup()
    expect(toJson(enzymeWrapper)).toMatchSnapshot();
  })
})

describe('custom methods in ChoroplethMap component', () => {

  it('checks if computeState method works correct', () => {
    const { props, enzymeWrapper } = setup()
    let out = enzymeWrapper.instance().computeState(props)
    expect(out).toEqual({}) // because isFetched=false
    props.view.isFetched = true
    out = enzymeWrapper.instance().computeState(props)
    expect(out.data[0].locations).toEqual([
      props.countries['GB'].name,
      props.countries['US'].name
    ])
    expect(out.data[0].z).toEqual([
      props.data[100]['2017-01-01'][0].count,
      props.data[100]['2017-01-01'][1].count
    ])
  })

  it('checks how handleChange method works', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.state().riskToShow).toEqual(100)
    enzymeWrapper.instance().handleChange('riskToShow', {value: 1, label: 'DNS'})
    expect(enzymeWrapper.state().riskToShow).toEqual(1)
  })

})
