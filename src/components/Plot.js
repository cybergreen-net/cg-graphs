/* global Plotly */
import React from 'react';
import Plotly from 'plotly.js'

class PlotlyGraph extends React.Component {

    drawPlot = (data, options) => {
        options.images = [{
            "source": '/static/images/cybergreen-logo-square.png',
            "xref": "paper",
            "yref": "paper",
            "x": 0.57,
            "y": 0.37,
            "sizex": 0.3,
            "sizey": 0.3,
            "opacity": 0.2,
            "xanchor": "right",
            "yanchor": "bottom"
        }]
        Plotly.newPlot(this.props.graphID, data, options, {
            modeBarButtonsToRemove: [
                'hoverCompareCartesian',
                'hoverClosestCartesian',
                'sendDataToCloud',
                // 'autoScale2d',
                // 'zoomIn2d',
                // 'zoomOut2d',
                // 'pan2d',
                // 'zoom2d',
                'lasso2d',
                'select2d',
                // 'toggleHover'
            ],
            scrollZoom: true,
            displaylogo: false,
            showTips: true,


        });
    }

    //  - (2D): zoom2d, pan2d, select2d, lasso2d, zoomIn2d, zoomOut2d, autoScale2d, resetScale2d
    //  - (Cartesian): hoverClosestCartesian, hoverCompareCartesian
    //  - (3D): zoom3d, pan3d, orbitRotation, tableRotation, handleDrag3d, resetCameraDefault3d, resetCameraLastSave3d, hoverClosest3d
    //  - (Geo): zoomInGeo, zoomOutGeo, resetGeo, hoverClosestGeo
    //  - hoverClosestGl2d, hoverClosestPie, toggleHover, resetViews

    componentDidMount() {
        this.drawPlot(this.props.data, this.props.graphOptions);
    }

    componentDidUpdate() {
        this.drawPlot(this.props.data, this.props.graphOptions);
        if (this.props.clickable) {
            document.getElementById(this.props.graphID).on('plotly_click', function(data) {
                if (data.points[0].data.name !== 'Rest') {
                    window.open(`asn/${data.points[0].data.name}`, '_blank')
                }
            });
        }
    }

    render() {
        return ( <
            div id = {
                this.props.graphID
            } > < /div>
        )
    }
}

export default PlotlyGraph;