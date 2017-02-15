import { SourceOfInfection } from '../src/components/SourceOfInfection';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Component is working', () => {
  function setup() {
    let props = {
      risks: {1: {title: 'Open DNS'}},
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
      data: {
        1: {
          GB: [
            {
              country: "GB",
              risk: 1,
              date: "2017-01-01",
              granularity: "",
              count: 2000,
              count_normalized: 123,
              count_amplified: "321",
              as: [
                {
                  id: 192,
                  count: 500,
                  count_amplified: ""
                },
                {
                  id: 254,
                  count: 550,
                  count_amplified: ""
                },
                {
                  id: 214,
                  count: 780,
                  count_amplified: ""
                }
              ]
            },
            {
              country: "GB",
              risk: 1,
              date: "2017-02-01",
              granularity: "",
              count: 2000,
              count_normalized: 123,
              count_amplified: "321",
              as: [
                {
                  id: 192,
                  count: 440,
                  count_amplified: ""
                },
                {
                  id: 254,
                  count: 620,
                  count_amplified: ""
                },
                {
                  id: 214,
                  count: 710,
                  count_amplified: ""
                }
              ]
            }
          ]
        }
      }
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
    expect(out.plotlyData.length).toEqual(6)
    expect(out.plotlyData[0].name).toEqual(props.view.AS.id[0])
    expect(out.plotlyData[1].name).toEqual(props.view.AS.id[1])
  })

  it('convertToPlotlySeries works', () => {
    const { enzymeWrapper, props } = setup()
    let out = enzymeWrapper.instance().convertToPlotlySeries(
      props.data[props.view.risk][props.view.country],
      props.view.AS.id[0]
    )
    expect(out.type).toEqual('bar')
    expect(out.x).toEqual(['2017-01-01', '2017-02-01'])
    expect(out.y).toEqual([500, 440])
    expect(out.name).toEqual(props.view.AS.id[0])
    out = enzymeWrapper.instance().convertToPlotlySeries(
      props.data[props.view.risk][props.view.country],
      undefined,
      true
    )
    expect(out.y).toEqual([170, 230])
    expect(out.name).toEqual('All the rest')
  })

})
