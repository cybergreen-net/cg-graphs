import { RiskPage } from '../src/components/RiskPage';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('CountryPage components', () => {
  it('tests if rendered output is expected', () => {
    const wrapper = shallow(<RiskPage
      views={{'gb/1': {}, 'us/1': {}}}
      />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
