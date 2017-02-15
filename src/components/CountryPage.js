import React, { Component } from 'react';
import { connect } from 'react-redux';
import CountryPerformanceOnRisk from './CountryPerformanceOnRisk';
import { SourceOfInfection } from './SourceOfInfection';
import '../css/temp.css' //this is temp import - needs to be removed for bundle


export class CountryPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {Object.keys(this.props.views).map((key, idx) => {
          return (
            <div key={key} className="row">
              <div className="col-md-6">
                <CountryPerformanceOnRisk view={this.props.views[key]} viewId={key}/>
              </div>
              <div className="col-md-6">
                <SourceOfInfection view={this.props.views[key]} viewId={key+idx} data={this.props.data}/>
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
    views: state.countryPerformanceOnRiskViews,
    data: state.entities.cubeByRiskByAS
  }
}


export default connect(mapStateToProps)(CountryPage)
