import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import ASPerformance from './ASPerformance';
import { PulseLoader } from 'halogenium';


export class ASPage extends Component {
  download() {
    let country = Object.values(this.props.views)[0].country
    let asn = Object.values(this.props.views)[0].as
    window.location = `/api/v1/count?limit=500&country=${country}&asn=${asn}&format=csv`
  }

  render() {
    let spinner = Object.values(this.props.views).find(view => {
      return view.isFetching
    })
    return ( <
      div > {
        spinner ? < PulseLoader size = '100px'
        color = '#00D49A'
        className = 'spinner' / > : ''
      } {
        Object.values(this.props.views).map(view => {
          return ( <
            div key = {
              view.id + 1
            }
            className = "row" >
            <
            div className = "panel panel-default container" >
            <
            ASPerformance view = {
              view
            }
            viewId = {
              view.id
            }
            /> <
            /div> <
            /div>
          )
        })
      } <
      button type = 'button'
      className = 'btn btn-primary-black btn-lg'
      onClick = {
        this.download.bind(this)
      } >
      Download Data in CSV <
      /button> <
      /div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    views: state.ASPerformanceViews
  }
}


export default connect(mapStateToProps)(ASPage)
