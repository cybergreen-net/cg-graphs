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
        {Object.values(this.props.views).map(view => {
          return (
            <div key={view.id} className="row">
              <div className="col-md-6 panel panel-default">
                <ASPerformance view={view} viewId={view.id}/>
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
