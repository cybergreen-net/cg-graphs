import React, { Component } from 'react';
import { connect } from 'react-redux';
import ASPerformance from './ASPerformance';
import Loader from 'halogen/BounceLoader';


export class ASPage extends Component {
  download() {
    let country = Object.values(this.props.views)[0].country
    let asn = Object.values(this.props.views)[0].as
    window.location = `/api/v1/count_by_country?limit=500&country=${country}&asn=${asn}&format=csv`
  }

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
        <button type='button' className='btn btn-primary-black btn-lg' onClick={this.download.bind(this)}>
          Download
        </button>
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
