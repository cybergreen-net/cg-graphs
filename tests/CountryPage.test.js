import { CountryPage } from '../src/components/CountryPage';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('CountryPage components', () => {
  it('test', () => {
    const wrapper = shallow(<CountryPage views={{'gb/1': {}, 'us/1': {}}} />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
