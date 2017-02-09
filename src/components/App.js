import React, { Component } from 'react';
import setDataFromUrl from './../utils/Points.js'
import Plot from './Plot.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    for (var i = 0; i < this.props.urls.length; i++) {
      setDataFromUrl(this, this.props.urls[i].url, this.props.urls[i].name);
    }
  };

  render() {
    return (
      <div>
        <Plot data={this.state.data} graphOptions={{barmode: 'stack'}} graphID={'ddos'}/>
      </div>
    );
  }
}

export default App;
