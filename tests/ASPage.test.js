import { ASPage } from '../src/components/ASPage';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('ASPage component', () => {
  it('renders expected DOM', () => {
    const wrapper = shallow(<ASPage views={{'gb/1/174': {}, 'gb/2/174': {}}} />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
