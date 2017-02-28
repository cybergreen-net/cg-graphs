import React, { Component } from 'react';
import { connect } from 'react-redux';
import CountryPerformanceOnRisk from './CountryPerformanceOnRisk';
import '../css/temp.css' //this is temp import - needs to be removed for bundle

import Loader from 'halogen/BounceLoader'
import 'react-select/dist/react-select.css';


export class RiskPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      spinner: '0px'
    }
  }


  render() {
    let spinner = Object.values(this.props.views).find(view => {
      return view.isFetching
    })
    return (
      <div>
        { spinner ? <Loader size='100px' color='#00D49A' className='spinner'/> : '' }
        <Loader size={this.state.spinner} color='#00D49A' className='spinner'/>

        {Object.values(this.props.views).map(view => {
          return (
            <div key={view.id+1} className="row">
              <div className="col-md-12 panel panel-default">
                <CountryPerformanceOnRisk view={view} viewId={view.id}/>
              </div>
            </div>
          )
        })}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    views: state.countryPerformanceOnRiskViews
  }
}


export default connect(mapStateToProps)(RiskPage)
