import { CountryPerformanceOnRisk, CountrySelect }
from '../src/components/CountryPerformanceOnRisk';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';


describe('Components are working fine', () => {
  function setup() {
    let props = {
      dispatch: jest.fn(),
      cubeByRiskByCountry: {
        1: {
          gb: [
            {
              "risk": 1,"country": "GB","date": "2017-01-16",
              "count": "11506","count_amplified": 4571746, "count_normalized": 123
            },
            {
              "risk": 1,"country": "GB","date": "2017-01-09",
              "count": "13330","count_amplified": 4646530, "count_normalized": 105
            },
            {
              "risk": 1,"country": "GB","date": "2017-01-02",
              "count": "11471","count_amplified": 4570311, "count_normalized": 100
            }
          ],
          ge: [
            {
              "risk": 1,"country": "GE","date": "2017-01-16",
              "count": "25712","count_amplified": 234192, "count_normalized": 111
            },
            {
              "risk": 1,"country": "GE","date": "2017-01-09",
              "count": "15898","count_amplified": 241818, "count_normalized": 189
            },
            {
              "risk": 1,"country": "GE","date": "2017-01-02",
              "count": "6324","count_amplified": 259284, "count_normalized": 103
            }
          ],
          kz: [
            {
              "risk": 1,"country": "KZ","date": "2017-01-16",
              "count": "29399","count_amplified": 1205359, "count_normalized": 220
            },
            {
              "risk": 1,"country": "KZ","date": "2017-01-09",
              "count": "30580","count_amplified": 1253780, "count_normalized": 90
            },
            {
              "risk": 1,"country": "KZ","date": "2017-01-02",
              "count": "27083","count_amplified": 1110403, "count_normalized": 56
            }
          ],
          us: [
            {
              "risk": 1,"country": "US","date": "2017-01-16",
              "count": "82772","count_amplified": 35373652, "count_normalized": 200
            },
            {
              "risk": 1,"country": "US","date": "2017-01-09",
              "count": "56717","count_amplified": 35125397, "count_normalized": 10
            },
            {
              "risk": 1,"country": "US","date": "2017-01-02",
              "count": "66268","count_amplified": 35516988, "count_normalized": 190
            },
          ],
          t: [
            {
              "risk": 1,"country": "T","date": "2017-01-16",
              "count": "81548","count_amplified": 156434762, "count_normalized": 120
            },
            {
              "risk": 1,"country": "T","date": "2017-01-09",
              "count": "33172","count_amplified": 157100602, "count_normalized": 30
            },
            {
              "risk": 1,"country": "T","date": "2017-01-02",
              "count": "32558","count_amplified": 156849067, "count_normalized": 330
            }
          ]
        }
      },
      countries: {
        '': {id: '', name: 'Select a country'},
        't': {id: 't', name: 'Global'},
        'ge': {id: 'ge', name: 'Georgia'},
        'kz': {id: 'kz', name: 'Kazakhstan'},
        'gb': {id: 'gb', name: 'United Kingdom'},
        'us': {id: 'us', name: 'United States'}
      },
      risks: {
        1: {title: 'Open DNS'},
        2: {title: 'Open NTP'},
        4: {title: 'Open SNMP'},
        5: {title: 'Open SSDP'},
        6: {title: 'Open Mirai'},
        100: {title: 'DDOS'}
      },
      graphOptions: {},
      view: {
        id: 1,
        type: "country/performance",
        country: "gb",
        risk: 1,
        measure: "count_normalized",
        selectorConfig: [
          {disabled: true, country: "gb"},
          {disabled: true, country: "t"},
          {disabled: false, country: undefined},
          {disabled: false, country: undefined},
          {disabled: false, country: undefined}
        ]
      }
    }

    const enzymeWrapper = shallow(<CountryPerformanceOnRisk {...props} />)

    return {
      props,
      enzymeWrapper
    }
  }

  it('computeState works', () => {
    const { enzymeWrapper, props } = setup()
    let out = enzymeWrapper.instance().computeState(props)
    expect(out.selectorConfig).toEqual(props.view.selectorConfig)
  })

  it('Renders expected DOM', () => {
    const { enzymeWrapper } = setup()
    expect(toJson(enzymeWrapper)).toMatchSnapshot();
  })

  it('convertToPlotlySeries method works', () => {
    const { enzymeWrapper, props } = setup()
    let out = enzymeWrapper.instance().convertToPlotlySeries('t', 1, props.cubeByRiskByCountry, 'count', undefined, 1)
    expect(out.type).toEqual('scatter')
    expect(out.x).toEqual(["2017-01-16", "2017-01-09", "2017-01-02"])
    expect(out.y).toEqual([81548, 33172, 32558])
    expect(out.name).toEqual('Global')
    out = enzymeWrapper.instance().convertToPlotlySeries('t', 1, props.cubeByRiskByCountry, 'count_normalized', undefined, 1)
    expect(out.y).toEqual([120, 30, 330])
    out = enzymeWrapper.instance().convertToPlotlySeries('t', 1, props.cubeByRiskByCountry, 'count_amplified', undefined, 1000000)
    expect(out.y).toEqual([156.434762, 157.100602, 156.849067])
  })

  it('When a country is selected, it updates state of the container', () => {
    const { enzymeWrapper, props } = setup()
    let newCountry = {value: 'us', label: 'United States'}
    enzymeWrapper.setState(enzymeWrapper.instance().computeState())
    expect(enzymeWrapper.find('CountrySelect').at(2).props().selectedCountry)
      .toEqual(undefined)
    enzymeWrapper.find('CountrySelect').at(2).simulate('change', newCountry)
    expect(props.dispatch.mock.calls.length).toEqual(2)
    expect(props.dispatch.mock.calls[0][0]).toEqual({
      "idxOfSelector": 2,
      "selectedCountry": "us",
      "type": "SELECT"
    })
  })

  it('When a measure button is selected, it updates state of the container', () => {
     const { enzymeWrapper, props } = setup()
     enzymeWrapper.setState(enzymeWrapper.instance().computeState())
     expect(enzymeWrapper.find('input').at(0).props().checked).toEqual(true)
     expect(enzymeWrapper.find('input').at(1).props().checked).toEqual(false)
     enzymeWrapper.find('input').at(0).simulate('onChange')
     enzymeWrapper.find('input').at(1).simulate('onChange')
     expect(enzymeWrapper.find('input').at(0).props().checked).toEqual(true)
     expect(enzymeWrapper.find('input').at(1).props().checked).toEqual(false)
  })
})

describe('Country Select component', () => {
  function setup() {
    let props = {
      countries: [
        {id: 't', name: 'Global'},
        {id: 'ge', name: 'Georgia'},
      ],
      onChange: jest.fn(),
      selectedCountry: undefined
    }

    const enzymeWrapper = shallow(< CountrySelect {...props} />)

    return {
      props,
      enzymeWrapper
    }
  }

  it('Dropdown is there', () => {
    const { enzymeWrapper } = setup()
    expect(toJson(enzymeWrapper)).toMatchSnapshot();
  })

  it('Selecting a country triggers event on parent component', () => {
    const { enzymeWrapper, props } = setup()
    const selector = enzymeWrapper.find('Select')
    expect(selector.props().value).toEqual({
      "label": "Select a country", "value": ""
    })
    let selectedOption = {value: 'uk', label: 'United Kingdom' }
    selector.props().onChange(selectedOption)
    expect(props.onChange.mock.calls.length).toEqual(1)
    expect(props.onChange.mock.calls[0][0]).toEqual(selectedOption)
  })
})
