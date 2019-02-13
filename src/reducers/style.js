import {
  SET_DOCUMENT_FONTFAMILY,
  SET_DOCUMENT_FONTSIZE,
  SET_MATH_FONTSIZE,
  SET_MATH_FONTWEIGHT,
  SET_PAGE_MARGIN,
  UPDATE_GRAPHSTYLE,
  RESET_GRAPHSTYLE,
} from '../actions/style'

import { kebabCase } from 'lodash'

const initialState = {
  columns: true,
  fontFamily: 'serif',
  fontSize: '8pt',
  mathFontSize: '1.1em',
  mathFontWeight: 'normal',
  pageSize: 'letter',
  pageOrientation: 'portrait',
  pageMargin: '0.5in',
  graph: {
    asymptoteColor: '#888888',
    asymptoteWidth: '0.6mm',
    axisColor: '#111111',
    axisWidth: '0.3mm',
    fillOpacity: '0.2',
    function1Color: '#ff3600',
    function2Color: '#0080d9',
    //function3Color: '#70cc3e',
    functionWidth: '0.4mm',
    geomColor: '#000000',
    geomWidth: '0.3mm',
    gridColor: '#888888',
    gridWidth: '0.1mm',
    labelFontSize: '1em',
  },
}

const style = function(state=initialState, action) {
  switch(action.type) {
    // Fonts
    case SET_DOCUMENT_FONTFAMILY:
      document.body.style.setProperty('--doc-font-family', action.payload)
      return {...state, fontFamily: action.payload}
    case SET_DOCUMENT_FONTSIZE:
      document.body.style.setProperty('--doc-font-size', action.payload)
      return {...state, fontSize: action.payload}
    case SET_MATH_FONTSIZE:
      document.body.style.setProperty('--doc-math-font-size', action.payload)
      return {...state, mathFontSize: action.payload}
    case SET_MATH_FONTWEIGHT:
      document.body.style.setProperty('--doc-math-font-weight', action.payload)
      return {...state, mathFontWeight: action.payload}

    // Page Layout
    case SET_PAGE_MARGIN:
      return {...state, pageMargin: action.payload}

    // Graph Style
    case UPDATE_GRAPHSTYLE:
      for (const k in action.payload) {
        document.body.style.setProperty(`--vg-${kebabCase(k)}`, action.payload[k])
      }
      return {...state, graph: {...state.graph, ...action.payload}}
    case RESET_GRAPHSTYLE:
      for (const k in initialState.graph) {
        document.body.style.setProperty(`--vg-${kebabCase(k)}`, initialState.graph[k])
      }
      return {...state, graph: {...initialState.graph}}

    default:
      return state
  }
}

export default style