import CountryPerformanceOnRisk from '../src/components/CountryPerformanceOnRisk.js'
import React from 'react'
import {shallow} from 'enzyme'


describe('Components are working fine', () => {
  it('Div with id plot is there', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    expect(wrapper.html()).toContain('<div id="plot"></div>')
  })

  it('Input tag for search is there', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    expect(wrapper.html()).toContain('<input type="text" placeholder="Search.."/>')
  })

  it('computeState works', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    let out = wrapper.instance().computeState()
    expect(out.hasOwnProperty('data')).toBeTruthy()
    expect(out.hasOwnProperty('graphOptions')).toBeTruthy()
    expect(out.hasOwnProperty('matchedCountry')).toBeTruthy()
    expect(out.hasOwnProperty('countries')).toBeTruthy()
  })

  it('handleSearch works', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    wrapper.setState({ countries: [
      {id: 'uk', name: 'United Kingdom'},
      {id: 'us', name: 'United States'}
    ]})
    let event = {target: {value: 'u'}}
    let out = wrapper.instance().handleSearch(event)
    expect(wrapper.state().matchedCountry.length).toEqual(2)
    expect(wrapper.state().matchedCountry[0].id).toEqual('uk')
    expect(wrapper.state().matchedCountry[1].id).toEqual('us')
    event = {target: {value: 'k'}}
    out = wrapper.instance().handleSearch(event)
    expect(wrapper.state().matchedCountry[0].id).toEqual('uk')
    expect(wrapper.state().matchedCountry.length).toEqual(1)
  })
})
