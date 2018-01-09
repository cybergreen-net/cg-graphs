import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux'
import PlotlyGraph from './Plot.js';
import Select from 'react-select';
import update from 'react/lib/update'
import Highlighter from 'react-highlight-words'
import 'react-select/dist/react-select.css';
//need to move file to this location
//import '../api/publicAnnotation.json';
import {
  countryIsSelected,
  fetchDataIfNeeded,
  getCountryRanking,
  changeMeasure
} from '../actions/cubeActions';

let annotation_dates = [];
let annotation_notes = [];
let annotations = [];
let annotationFormat = [{
  type: 'date',
  x: annData.notes[ann_num].annotation_date,
  y: 0,
  xref: 'x',
  yref: 'y',
  align: 'middle',
  valign: 'center',
  text: '',
  borderwidth: 0,
  showarrow: true,
  arrowsize: 0,
  arrowwidth: 1,
  arrowcolor: '#FC9F5B',
  arrowhead: 6,
  opacity: 0.8,
  ax: 0,
  ay: -200,
}];

//filter annotation Country Comparison
function annotationFetchAndFilter(risk_id, country_code, asn) {
  return (
      fetch(`/static/scripts/publicAnnotation.json`)
      //change to /api/publicAnnotation.json for staging
      .then((response) => {
        return response.json()
      })

      .then((annData) => {
          console.log(annData);
          for (var ann_num in annData.notes) {
            console.log(props.view);
            if (annData.notes[ann_num].risk_id == props.view.risk) {
              console.log(ann_num);
              console.log(annData.notes[ann_num].annotation_date);
              annotation_dates.push(annData.notes[ann_num].annotation_date);
              annotation_notes.push(annData.notes[ann_num].annotation_date + '\n' + annData.notes[ann_num].annotation);
              annotations.push({
                return (props.view.annotationFormat)
              })
              if (annData.notes[ann_num].country_code && annotation.country_code == props.view.country) {
                annotation_dates.push(annData.notes[ann_num].annotation_date);
                annotation_notes.push(annData.notes[ann_num].annotation_date + '\n' + annData.notes[ann_num].annotation);
                annotations.push({
                  return (props.view.annotationFormat)
                })
              }
              if (annData.notes[ann_num].asn && annotation.asn == props.view.asn) {
                annotation_dates.push(annData.notes[ann_num].annotation_date);
                annotation_notes.push(annData.notes[ann_num].annotation_date + '\n' + annData.notes[ann_num].annotation);
                annotations.push({
                  return (props.view.annotationFormat)
                })
              }
              else if (annData.notes[ann_num].asn && annData.notes[ann_num].country_code != annData.notes[ann_num].asn && annData.notes[ann_num].country_code) {
                annotation_dates.push(annData.notes[ann_num].annotation_date);
                annotation_notes.push(annData.notes[ann_num].annotation_date + '\n' + annData.notes[ann_num].annotation);
                annotations.push({
                  return (props.view.annotationFormat)
                })
              }
            }
          }
        };
        /* if annotation.risk_id is risk_id {
               if country_code and annotation.country_code is country_code {
                      push annotation to list
               }
               if asn and annontation.asn is asn {
                      push annotation to list
               }
               if not asn and not country_code {
                      push annotation to list
               }
           }
           ....
        } */
