import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';
import React from "react";
import sinon from 'sinon';
import {expect} from 'chai'
import Plot from './../src/components/Plot.js';
import App from './../src/components/App.js';


describe("plotly chart module", () => {

  it("should have generated plotly graph", () => {
    //sinon.spy(Plot.prototype, 'componentDidMount')
    const wrapper = shallow(<Plot data={[]} />)
    expect(wrapper.contains(<div id="plot" />)).to.equal(true)
  })
  
  it("Should have Plot component", () => {
    //sinon.spy(Plot.prototype, 'componentDidMount')
    const wrapper = shallow(<App urls={[]} />)
    expect(wrapper.find(< Plot />)).to.have.length(0)
  })

})
