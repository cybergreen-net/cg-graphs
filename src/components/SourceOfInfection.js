import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux'
import PlotlyGraph from './Plot.js';
import update from 'react/lib/update'
// import notes from `../stats-new/api/annotations/publicAnnotation.json`;

export class SourceOfInfection extends Component {
    constructor(props) {
        super(props)
        // let annotation_dates = [];
        // let annotation_notes = [];
        // let annotations = [];
        // fetch(`/static/scripts/publicAnnotation.json`)
        //     .then((response) => {
        //         return response.json()
        //     })
        //     .then((annFilterByCountry) => {
        //         for (var ann_num in annFilterByCountry.notes) {
        //             if (annFilterByCountry.notes[ann_num].country_code == props.view.country && annFilterByCountry.notes[ann_num].risk_id == props.view.risk) {
        //                 annotation_dates.push(annFilterByCountry.notes[ann_num].annotation_date);
        //                 annotation_notes.push(annFilterByCountry.notes[ann_num].annotation_date + '\n' + annFilterByCountry.notes[ann_num].annotation);
        //                 annotations.push({
        //                     type: 'date'
        //                 });
        //             }
        //             if (annFilterByCountry.notes[ann_num].country_code == 999 && annFilterByCountry.notes[ann_num].risk_id == props.view.risk) {
        //                 annotation_dates.push(annFilterByCountry.notes[ann_num].annotation_date);
        //                 annotation_notes.push(annFilterByCountry.notes[ann_num].annotation_date + '\n' + annFilterByCountry.notes[ann_num].annotation);
        //                 annotations.push({
        //                     type: 'date'
        //                 });
        //             }
        //         }
        //     });



        this.state = {
            graphOptions: {
                barmode: 'relative',
                height: 252,
                margin: {
                    l: 40,
                    r: 30,
                    b: 30,
                    t: 0
                },
                spikedistance: -1,
                scene: {
                    xaxis: {
                        showspikes: true
                    },
                    yaxis: {
                        showspikes: false,
                    },
                },
                xaxis: {
                    gridcolor: 'transparent',
                    tickformat: '%d %b %Y',
                    rangemode: 'nonnegative',
                    rangemode: 'tozero',
                    autorange: true
                },
                yaxis: {
                    title: this.props.view.yLabel,
                    rangemode: 'nonnegative',
                    rangemode: 'tozero',
                    autorange: true

                },
                font: {
                    size: 9,
                    color: '#7f7f7f'
                },
                hovermode: 'closest',
                showlegend: true,
                zeroline: true
            },
            // annotation_dates: annotation_dates,
            // annotation_notes: annotation_notes,
            plotlyData: []
        }
    }


    computeState(props = this.props) {
        let plotlyData = []

        props.data[props.view.risk][props.view.country].forEach(dataEntry => {
            let colorPallet = [
               '#11d48b', '#115ad4', '#d4115a',
                '#d48b11', '#8800d4'
            ]
            let countAllRest = parseInt(dataEntry[props.view.measure]) / props.view.unitDevider

            dataEntry.as.forEach((asn, idx) => {
                countAllRest -= parseInt(asn[props.view.measure]) / props.view.unitDevider
                let trace = this.plotlySeries(dataEntry, asn, props.view.measure, props.view.unitDevider)
                trace['marker'] = {
                    color: colorPallet[idx],
                    legendgroup: ['traces']
                }
                plotlyData.push(trace)
            })

            let traceAllRest = {
                x: [dataEntry.date],
                y: [countAllRest],
                type: 'bar',
                name: 'Rest',
                showlegend: false,
                legendgroup: ['AtRest'],
                marker: {
                    color:  '#d42911'
                },
                text: ['Rest'],
                hoverinfo: 'y+x+name'
            }
            plotlyData.unshift(traceAllRest)
        })
        let state = {
            plotlyData: plotlyData
        }
        // // Start of annotations are added
        // plotlyData.splice(6, 0, {
        //     // type: 'scatter',
        //     mode: 'markers',
        //     x: this.state.annotation_dates,
        //     y: this.state.annotation_dates.map(function(x) {
        //         return 0
        //     }),
        //     marker: {
        //         symbol: 'square',
        //         color: '#a5d400',
        //         xaxis: {
        //             gridcolor: 'transparent',
        //             tickformat: '%d %b %Y',
        //             spikemode: 'across',
        //             spikedash: 'dash',
        //             spikesnap: 'data',
        //             spikethickness: 1
        //         },
        //     },
        //     legendgroup: 'Annotations',
        //     name: 'Annotations',
        //     hoveron: 'points',
        //     hoverinfo: 'text',
        //     hoverlabel: { textposition: 'middle-left', },
        //     text: this.state.annotation_notes
        // });
        // // End of annotations are added
        if (props.view.unit && props.view.risk === 100 && props.view.normMeasure !== 'count_normalized') {
            state.graphOptions = update(this.state.graphOptions, {
                yaxis: {
                    title: {
                        $set: props.view.unit
                    }
                }
            });
        }
        return state
    }


    plotlySeries(data, asn, measure, unitDevider) {
        var title = this.props.asns[asn.id] ? this.props.asns[asn.id].title : 'Unknown'
        return {
            x: [data.date],
            y: [asn[measure] / unitDevider],
            type: 'bar',
            name: asn.id, //+ ' | ' + title,
            //barmode: 'stacked',
            legendgroup: 'AllTraces',
            text: asn.id + ' | ' + title.substring(0, 20),
            showlegend: false,
            mode: 'markers+text',
            //hoverinfo: 'x+y'
        }
    }


    componentDidMount() {
        if (this.props.data[this.props.view.risk] && this.props.data[this.props.view.risk][this.props.view.country]) {
            this.setState(this.computeState(this.props))
        }
    };


    componentWillReceiveProps(nextProps) {
        if (nextProps.data[this.props.view.risk] && nextProps.data[this.props.view.risk][this.props.view.country]) {
            this.setState(this.computeState(nextProps))
        }
    }


    render() {
        return ( <
            div >
            <
            h3 > {
                this.props.risks[this.props.view.risk].title.toUpperCase()
            } {
                ` `
            } | {
                ` `
            }
            AS SOURCE <
            /h3> <
            PlotlyGraph data = {
                this.state.plotlyData
            }
            graphOptions = {
                this.state.graphOptions
            }
            graphID = {
                this.props.viewId
            }
            clickable = {
                true
            }
            /> < /
            div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.entities.cubeByRiskByCountry,
        risks: state.entities.risks,
        asns: state.entities.asn
    }
}

export default connect(mapStateToProps)(SourceOfInfection)
