import {CountryPerformanceOnRisk, CountrySelect } from '../src/components/CountryPerformanceOnRisk.js'
import React from 'react'
import {shallow} from 'enzyme'
import toJson from 'enzyme-to-json';


describe('Components are working fine', () => {

  it('computeState works', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    let out = wrapper.instance().computeState()
    expect(out.hasOwnProperty('data')).toBeTruthy()
    expect(out.hasOwnProperty('graphOptions')).toBeTruthy()
  })

  it('Div with id DDOS-graph is there', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })

})

describe('Country Select', () => {
  it('Dropdown is there', () => {
    const wrapper = shallow(< CountrySelect selectOptions={[]}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
