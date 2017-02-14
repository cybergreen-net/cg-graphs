import React, { Component } from 'react';
import { connect } from 'react-redux';
import CountryPerformanceOnRisk from './CountryPerformanceOnRisk';
import { SourceOfInfection } from './SourceOfInfection';


export class CountryPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {Object.keys(this.props.views).map((key, idx) => {
          return (
            <div key={key}>
              <CountryPerformanceOnRisk view={this.props.views[key]} viewId={key}/>
              <SourceOfInfection view={this.props.views[key]} viewId={key+idx} data={this.props.data}/>
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
