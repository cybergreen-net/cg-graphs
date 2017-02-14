import { SourceOfInfection } from '../src/components/SourceOfInfection';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Component is working', () => {
  function setup() {
    let props = {
      view: {
        id: 'GB/1',
        country: 'GB',
        risk: 1,
        AS: {
          id: [192, 254],
          isFetched: false,
          isFetching: false,
          didFailed: false
        }
      },
      data: [
        {
          country: "GB",
          risk: 1,
          date: "2017-01-01",
          count: 2000,
          as: [
            {
              id: 192,
              count: 500
            },
            {
              id: 254,
              count: 550
            }
          ]
        },
        {
          country: "GB",
          risk: 1,
          date: "2017-02-01",
          count: 2000,
          as: [
            {
              id: 192,
              count: 440
            },
            {
              id: 254,
              count: 620
            }
          ]
        }
      ]
    }

    const enzymeWrapper = shallow(<SourceOfInfection {...props} />)

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
    expect(out.plotlyData.length).toEqual(3)
    expect(out.plotlyData[0].name).toEqual(props.view.AS.id[0])
    expect(out.plotlyData[1].name).toEqual(props.view.AS.id[1])
    expect(out.plotlyData[2].name).toEqual('All the rest')
  })

  it('convertToPlotlySeries works', () => {
    const { enzymeWrapper, props } = setup()
    let out = enzymeWrapper.instance().convertToPlotlySeries(props.data, props.view.AS.id[0])
    expect(out.type).toEqual('bar')
    expect(out.x).toEqual(['2017-01-01', '2017-02-01'])
    expect(out.y).toEqual([500, 440])
    expect(out.name).toEqual(props.view.AS.id[0])
    out = enzymeWrapper.instance().convertToPlotlySeries(props.data, undefined, true)
    expect(out.y).toEqual([950, 940])
    expect(out.name).toEqual('All the rest')
  })

})
