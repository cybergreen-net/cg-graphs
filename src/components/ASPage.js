import React, { Component } from 'react';
import { connect } from 'react-redux';
import ASPerformance from './ASPerformance';
import Loader from 'halogen/BounceLoader';


export class ASPage extends Component {
  render() {
    let spinner = Object.values(this.props.views).find(view => {
      return view.isFetching
    })
    return (
      <div>
        { spinner ? <Loader size='100px' color='#00D49A' className='spinner'/> : '' }
        {Object.values(this.props.views).map(view => {
          return (
            <div key={view.id+1} className="row">
              <div className="panel panel-default container">
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
