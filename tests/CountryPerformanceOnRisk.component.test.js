import CountryPerformanceOnRisk from '../src/components/CountryPerformanceOnRisk.js'
import React from 'react'
import {shallow} from 'enzyme'


describe('Components are working fine', () => {
  it('Div with id plot is there', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    expect(wrapper.html()).toContain('<div><div id="plot"></div></div>')
  })


  it('computeState works', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    let out = wrapper.instance().computeState();
    expect(out.hasOwnProperty('data')).toBeTruthy();
    expect(out.hasOwnProperty('graphOptions')).toBeTruthy();
  })
})
