import React, { Component } from 'react';
import PlotlyGraph from './Plot.js'


class CountryPerformanceOnRisk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      graphOptions: {},
      countries: [],
      matchedCountry: {},
      graphsToShow: [],
      graphs: {}
    }
  }


  computeState() {
    let xValues = ['2017-01-01','2017-01-08','2017-01-15'];
    let reduxStore = {
      entities: {
        graphs: {
            1: {
            title: 'DDOS-graph',
            dataToshow: ['t1','t2'],
            graphLayout: ['l1']
          }
         },
        data: {
          t1: {
            x: xValues,
            y: [2,4,6],
            name: 'example N1',
            type: 'scatter'
          },
          t2: {
            x: xValues,
            y: [1,4,7],
            name: 'example N2',
            type: 'scatter'
          }
        },
        layouts: {
          l1: {
            title : 'Global DDOS potential',
            height: 600,
            barmode: 'stack',
            xaxis: {
              title: '*This chart assumes an average 1 mbit/sec Internet connection for every IP address.',
              gridcolor: 'transparent',
            },
            yaxis: {
              title: 'GBit/sec'
            }
          }
        },
        countries: [
          {id: 'uk', name: 'United Kingdom'},
          {id: 'us', name: 'United States'}
        ]
      },
      graphsToShow: [1]
    }

    let state = {
      graphsToShow: reduxStore.graphsToShow,
      graphs: reduxStore.entities.graphs,
      data : reduxStore.entities.data,
      graphOptions: reduxStore.entities.layouts,
      countries: reduxStore.entities.countries,
      matchedCountry: {}
    }
    return state
  }


  handleSearch(event) {
    let searchedCountry = this.state.countries.filter( country => {
      return country.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
    })
    if(searchedCountry) {
      this.setState({
        matchedCountry: searchedCountry
      })
    }
  }


  componentDidMount() {
    this.setState(this.computeState())
  };


  render() {
    let graphsToShow = this.state.graphsToShow
    let graphs = this.state.graphs
    let data = this.state.data
    let graphOptions = this.state.graphOptions
    return (
      <div>
        {graphsToShow.map(id => {
          let dataForGraph = graphs[id].dataToshow.map(line => {
            return data[line]
          })
          let layoutForGraph = graphs[id].graphLayout.map(layout => {
            return graphOptions[layout]
          })
          return <div key={graphs[id].title}>
            < PlotlyGraph
            data={dataForGraph}
            graphOptions={layoutForGraph}
            graphID={graphs[id].title}/>

            < input type="text"
              placeholder="Search.."
              value={this.state.search}
              onChange={this.handleSearch.bind(this)} />
          </div>
        })}
      </div>
    );
  }
}

export default CountryPerformanceOnRisk;
