import {
  SET_DOCUMENT_FONTFAMILY,
  SET_DOCUMENT_FONTSIZE,
  SET_MATH_FONTSIZE,
  SET_MATH_FONTWEIGHT,
  SET_PAGE_MARGIN,
  UPDATE_GRAPHSTYLE,
  RESET_GRAPHSTYLE,
} from '../actions/style'


const initialState = {
  columns: true,
  fontFamily: 'IBM Plex Serif',
  fontSize: '8pt',
  mathFontSize: '0.9em',
  mathFontWeight: 'normal',
  pageSize: 'letter',
  pageOrientation: 'portrait',
  pageMargin: '0.5in',
  graph: {
    asymptoteColor: '#777777',
    asymptoteWidth: '0.7mm',
    axisColor: '#222222',
    axisWidth: '0.3mm',
    gridColor: '#888888',
    gridWidth: '0.1mm',
    plot1PathColor: '#ff2600',
    plot2PathColor: '#0080d9',
    //plot3PathColor: '#70cc3e',
    //plot4PathColor: '#ffa000',
    plotPathWidth: '0.5mm',
    //geomPathColor: '#337744',
    geomPathColor: '#379600',
    geomPathWidth: '0.5mm',
    fillOpacity: '0.3',
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
    case RESET_GRAPHSTYLE:
      return {...state, graph: {...initialState.graph}}

    default:
      return state
  }
}

export default style