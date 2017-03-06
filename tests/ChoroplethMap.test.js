import { ChoroplethMap } from '../src/components/ChoroplethMap';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('ChoroplethMap component', () => {
  it('render PlotlyGraph component with expected props', () => {
    const wrapper = shallow(<ChoroplethMap />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})

describe('custom methods in ChoroplethMap component', () => {
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

})
