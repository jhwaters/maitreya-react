import {
  SET_DOCUMENT_FONTFAMILY,
  SET_DOCUMENT_FONTSIZE,
  SET_MATH_FONTSIZE,
  SET_MATH_FONTWEIGHT,
  SET_PAGE_MARGIN,
  UPDATE_GRAPHSTYLE,
} from '../actions/style'


const initialState = {
  fontFamily: 'Lora',
  fontSize: '8pt',
  mathFontSize: '0.9em',
  mathFontWeight: 'normal',
  pageSize: 'letter',
  pageOrientation: 'portrait',
  pageMargin: '10mm 10mm 10mm 10mm',
  graph: {
    asymptoteColor: '#555555',
    axisColor: '#222222',
    axisWidth: '0.4mm',
    gridColor: '#8899aa',
    gridWidth: '0.2mm',
    pathColor: '#cc0077',
    pathWidth: '0.5mm',
  },
}

const style = function(state=initialState, action) {
  switch(action.type) {
    // Fonts
    case SET_DOCUMENT_FONTFAMILY:
      return {...state, fontFamily: action.payload}
    case SET_DOCUMENT_FONTSIZE:
      return {...state, fontSize: action.payload}
    case SET_MATH_FONTSIZE:
      return {...state, mathFontSize: action.payload}
    case SET_MATH_FONTWEIGHT:
      return {...state, mathFontWeight: action.payload}

    // Page Layout
    case SET_PAGE_MARGIN:
      return {...state, pageMargin: action.payload}

    // Graph Style
    case UPDATE_GRAPHSTYLE:
      return {...state, graph: {...state.graph, ...action.payload}}

    default:
      return state
  }
}

export default style