import CountryPerformanceOnRisk from '../src/components/CountryPerformanceOnRisk.js'
import React from 'react'
import {shallow} from 'enzyme'


describe('Components are working fine', () => {
  it('Div with id plot is there', () => {
    const wrapper = shallow(< CountryPerformanceOnRisk urls={[]}/>)
    expect(wrapper.html()).toEqual('<div><div id="plot"></div></div>')
  })
})
