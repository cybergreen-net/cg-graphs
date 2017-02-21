import PlotlyGraph from '../src/components/Plot';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('PlotlyGraph component', () => {
  it('renders a spinner when data is not yet fetched', () => {
    const wrapper = shallow(<PlotlyGraph graphID={'gb/1'} data={[]} />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
  it('does not render a spinner when data is fetched', () => {
    const wrapper = shallow(<PlotlyGraph graphID={'gb/1'} data={[{x:1,y:1}]} />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
