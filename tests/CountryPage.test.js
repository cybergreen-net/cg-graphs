import { CountryPage } from '../src/components/CountryPage';
import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('CountryPage components', () => {
  it('tests if rendered output is expected', () => {
    const wrapper = shallow(<CountryPage
      views={{'gb/1': {}, 'us/1': {}}}
      asn={{174: {number: 174, title: 'ASN 174'}}}
      />)
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
