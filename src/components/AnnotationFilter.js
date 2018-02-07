// import React, {
//   Component
// } from 'react';
// import {
//   connect
// } from 'react-redux'
// import PlotlyGraph from './Plot.js';
// import Select from 'react-select';
// import update from 'react/lib/update'
// import Highlighter from 'react-highlight-words'
// import 'react-select/dist/react-select.css';
// //need to move file to this location
// //import '../api/publicAnnotation.json';
// import {
//   countryIsSelected,
//   fetchDataIfNeeded,
//   getCountryRanking,
//   changeMeasure
// } from '../actions/cubeActions';
//
// // Filter by country and risk
// let annotation_dates = [];
// let annotation_notes = [];
// let annotations = [];
// fetch(`/static/scripts/publicAnnotation.json`)
//   .then((response) => {
//     return response.json()
//   })
//   .then((annFilterByCountry) => {
//       for (var ann_num in annFilterByCountry.notes) {
//         if (annFilterByCountry.notes[ann_num].country_code == props.view.country && annFilterByCountry.notes[ann_num].risk_id == props.view.risk) {
//           annotation_dates.push(annFilterByCountry.notes[ann_num].annotation_date);
//           annotation_notes.push(annFilterByCountry.notes[ann_num].annotation_date + '\n' + annFilterByCountry.notes[ann_num].annotation);
//           annotations.push({
//             type: 'date',
//             x: annFilterByCountry.notes[ann_num].annotation_date,
//             y: 0,
//             xref: 'x',
//             yref: 'y',
//             align: 'middle',
//             valign: 'center',
//             text: '',
//             borderwidth: 0,
//             showarrow: true,
//             arrowsize: 0,
//             arrowwidth: 1,
//             arrowcolor: '#FC9F5B',
//             arrowhead: 6,
//             opacity: 0.8,
//             ax: 0,
//             ay: -200,
//           });
//         }
//         if (annFilterByCountry.notes[ann_num].country_code == 999 && annFilterByCountry.notes[ann_num].risk_id == props.view.risk) {
//           annotation_dates.push(annFilterByCountry.notes[ann_num].annotation_date);
//           annotation_notes.push(annFilterByCountry.notes[ann_num].annotation_date + '\n' + annFilterByCountry.notes[ann_num].annotation);
//           annotations.push({
//             type: 'date',
//             x: annFilterByCountry.notes[ann_num].annotation_date,
//             y: 0,
//             xref: 'x',
//             yref: 'y',
//             align: 'middle',
//             valign: 'center',
//             text: '',
//             borderwidth: 0,
//             showarrow: true,
//             arrowsize: 0,
//             arrowwidth: 1,
//             arrowcolor: '#FC9F5B',
//             arrowhead: 6,
//             opacity: 0.8,
//             ax: 0,
//             ay: -200,
//           });
//         }
//       }
//     }
//   );
//
//
//
// // Filter by ASN
// let annotation_dates = [];
// let annotation_notes = [];
// let annotations = [];
// fetch(`/static/scripts/publicAnnotation.json`)
//   .then((response) => {
//     return response.json()
//   })
//   .then((annFilterByAsn) => {
//
//     for (var ann_num in annFilterByAsn.notes) {
//       if (annFilterByCountry.notes[ann_num].asn == props.view.asn) {
//         annotation_dates.push(annFilterByAsn.notes[ann_num].annotation_date);
//         annotation_notes.push(annFilterByAsn.notes[ann_num].annotation_date + '\n' + annFilterByAsn.notes[ann_num].annotation);
//         annotations.push({
//           type: 'date',
//           x: annFilterByCountry.notes[ann_num].annotation_date,
//           y: 0,
//           xref: 'x',
//           yref: 'y',
//           align: 'middle',
//           valign: 'center',
//           text: '',
//           borderwidth: 0,
//           showarrow: true,
//           arrowsize: 0,
//           arrowwidth: 1,
//           arrowcolor: '#FC9F5B',
//           arrowhead: 6,
//           opacity: 0.8,
//           ax: 0,
//           ay: -200,
//         });
//       }
//     }
//   });
//
// // idea for a work around to turn on annotation when a marker is clicked
// //   var clickFunction = [{
// //     points: [
// //       curvernumber: 1, // index of the curve clicked on
// //       pointnumber: 1, // index of the point clicked on
// //       x: this.state.annotation_dates, // x coordinate clicked on
// //       y: this.state.annotation_dates.map(function(x) {
// //         return 0
// //       }), // y coordinate clicked on
// //       data: {}, // trace object of this curve
// //       fullData: {}, //  full trace object (that includes the defaults) of this curve
// //       xaxis: {}, // layout xaxis object corresponding to this curve
// //       yaxis: {} // '' yaxis ""
// //     ]
// //   }];
// //
// //   graphDiv.on('plotly_click', function(onClick) {
// //       /* callback goes here */
// //       plotlyData.splice(1, 0, {
// //         //x: ['2016-01-01', '2016-05-30', '2017-05-05'],
// //         x: this.state.annotation_dates,
// //         y: this.state.annotation_dates.map(function(x) {
// //           return 0
// //         }),
// //         //y: [0, 0, 0],
// //         mode: 'markers',
// //         marker: {
// //           color: 'rgba(252, 159, 91, .8)',
// //           size: 8,
// //           name: 'Annotation'
// //         },
// //         hovermode: 'closest',
// //         hoveron: 'points',
// //         hoverlabel: {
// //           bgcolor: '#FC9F5B',
// //           bordercolor: '#000000'
// //         },
// //         hoverinfo: 'text', //if `none` is set, click and hover events
// //         text: this.state.annotation_notes,
// //       });
// //
// //       state['plotlyData'] = plotlyData //.push(props.view.annotations) //push overrides the x values of the graph
// //
// //     }
// //   });
// //
// // function(onClick, getClick, getClickObj) {
// //   getClick.apply(getClickObj, [onClick])
// // });
