import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {ASPerformance} from '../src/components/ASPerformance';

describe('ASPerformance component is working as expected', () => {
  function setup() {
    let props = {
      asn: {
        174: {
          id: 174,
          name: 'ASN 174'
        }
      },
      view: {
        id: 'GB/1/174',
        as: 174,
        risk: 1,
        country: 'GB',
        type: 'as/performance',
        isFetched: false,
        isFetching: false,
        didFailed: false,
        measure: "count_normalized",
        selectorConfig: [
          {disabled: true, as: 174},
          {disabled: true, as: 0},
          {disabled: false, as: undefined},
          {disabled: false, as: undefined},
          {disabled: false, as: undefined}
        ]
      }
    }
    const enzymeWrapper = shallow(<ASPerformance {...props} />)

    return {
      props,
      enzymeWrapper
    }
  }

  it('renders expected DOM', () => {
    const { enzymeWrapper } = setup()
    expect(toJson(enzymeWrapper)).toMatchSnapshot();
  })
})
