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
