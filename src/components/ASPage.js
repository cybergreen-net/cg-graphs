import React, { Component } from 'react';
import { connect } from 'react-redux';
import ASPerformance from './ASPerformance';


export class ASPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {Object.keys(this.props.views).map(key => {
          return (
            <div key={key} className="row">
              <div className="col-md-6 panel panel-default">
                <ASPerformance view={this.props.views[key]} viewId={key}/>
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
    views: state.ASPerformanceViews
  }
}


export default connect(mapStateToProps)(ASPage)
