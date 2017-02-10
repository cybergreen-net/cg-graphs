import React, { Component } from 'react';
import { connect } from 'react-redux';
import CountryPerformanceOnRisk from './CountryPerformanceOnRisk';


export class CountryPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {Object.keys(this.props.views).map((key) => {
          return <CountryPerformanceOnRisk view={this.props.views[key]} key={key} id={key}/>
        })}
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    views: state.countryPerformanceOnRiskViews
  }
}


export default connect(mapStateToProps)(CountryPage)
