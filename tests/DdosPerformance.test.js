import { DdosPerformance } from '../src/components/DdosPerformance';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Component is working', () => {
  function setup() {
    let props = {
      view: {
        id: 'global/ddos',
        country: 'T',
        type: 'ddos/performance',
        isFetched: false,
        isFetching: false,
        didFailed: false,
        measure: "count_amplified",
        risksToView: [
          {id: 1, slug: 'opendns', title: 'Open Recursive DNS'}
        ]
      },
      data: {
        1: {
          T: [
            {
              country: "T",
              risk: 1,
              date: "2017-01-01",
              count: 2000,
              count_amplified: "2131",
              as: []
            },
            {
              country: "T",
              risk: 1,
              date: "2017-02-01",
              count: 2300,
              count_amplified: "2331",
              as: []
            }
          ]
        }
      }
    }

    const enzymeWrapper = shallow(<DdosPerformance {...props} />)

    return {
      props,
      enzymeWrapper
    }
  }

  it('Renders expected DOM', () => {
    const { enzymeWrapper } = setup()
    expect(toJson(enzymeWrapper)).toMatchSnapshot();
  })

  it('computeState works', () => {
    const { enzymeWrapper, props } = setup()
    let out = enzymeWrapper.instance().computeState(props)
    expect(out).toEqual({})
    props.view.isFetched = true
    out = enzymeWrapper.instance().computeState(props)
    expect(out.plotlyData.length).toEqual(1)
  })

  it('convertToPlotlySeries works', () => {
    const { enzymeWrapper, props } = setup()
    let out = enzymeWrapper.instance().convertToPlotlySeries(
      props.view.country,
      props.view.risksToView[0],
      props.data,
      props.view.measure,
      'rgb(0,0,0)'
    )
    expect(out.x).toEqual(["2017-01-01", "2017-02-01"])
    expect(out.y).toEqual([0.002131, 0.002331])
    expect(out.name).toEqual(props.view.risksToView[0].title)
    expect(out.type).toEqual('bar')
    expect(out.marker).toEqual({color:'rgb(0,0,0)'})
  })

})
