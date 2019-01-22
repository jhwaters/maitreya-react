import {
  ADD_TO_DOCUMENT,
  CLEAR_ALL,
  REMOVE_LAST,
  UPDATE_ELEMENT,
  SET_DOCUMENT_FONTFAMILY,
  SET_DOCUMENT_FONTSIZE,
  SET_DOCUMENT_STARTNUMBERING,
  SET_MATH_FONTSIZE,
  SET_MATH_FONTWEIGHT,
  SET_PAGE_MARGINS,
  ADD_PAGEBREAK_BEFORE,
  DELETE_ELEMENT,
} from '../actions/document'



const initialState = {
  content: {},
  order: [],
  headers: {
    first: {
      type: 'header',
      data: [
        {left: 'Assignment', right: 'Name ___'},
        {right: 'Date __ Class _'},
      ],
    },
    other: {type: 'header', data: []},
  },
  footers: {},
  pagebreaks: [],
  settings: {
    startNumbering: 1,
    fontSize: '8pt',
    fontFamily: 'CMUSerifRoman',
    mathFontSize: '0.9em',
    mathFontWeight: 'normal',
    pageSize: 'letter',
    pageOrientation: 'portrait',
    pageMargins: {
      top: '10mm',
      left: '10mm',
      right: '10mm',
      bottom: '10mm',
    },
  },
}

const document = function(state=initialState, action) {
  switch (action.type) {
    // content
    case ADD_TO_DOCUMENT:
      return {
        ...state, 
        content: {...state.content, [action.payload.id]: action.payload.element},
        order: [...state.order, action.payload.id]
      }
    case CLEAR_ALL:
      return {
        ...state, 
        content: {},
        order: [], 
        pagebreaks: [],
      }
    case REMOVE_LAST:
      return {
        ...state, 
        order: state.order.slice(0,-1), 
        pagebreaks: state.pagebreaks.filter(n => n < state.order.length),
      }
    case DELETE_ELEMENT:
      if (action.payload === 'header.first') {
        return {
          ...state, headers: {...state.headers, first: {type: 'header', data: []}}
        }
      }
      if (action.payload === 'header.other') {
        return {...state, headers: {...state.headers, other: {type: 'header', data: []}}}
      }
      //let newContent = {...state.content}
      //delete newContent[action.payload]
      return {
        ...state, 
        //content: newContent,
        order: state.order.filter(id => id !== action.payload),
        pagebreaks: state.pagebreaks.filter(n => n < state.order.length),
      }
    case UPDATE_ELEMENT:
      if (action.payload.id === 'header.first') {
        return {
          ...state, 
          headers: {...state.headers, first: action.payload.element}}
      }
      if (action.payload.id === 'header.other') {
        return {
          ...state, 
          headers: {...state.headers, other: action.payload.element}}
      }
      return {
        ...state, 
        content: {...state.content, [action.payload.id]: action.payload.element}
      }


    // settings
    case SET_DOCUMENT_FONTFAMILY:
      return {...state, settings: {...state.settings, fontFamily: action.payload}}
    case SET_DOCUMENT_FONTSIZE:
      return {...state, settings: {...state.settings, fontSize: action.payload}}
    case SET_MATH_FONTSIZE:
      return {...state, settings: {...state.settings, mathFontSize: action.payload}}
    case SET_MATH_FONTWEIGHT:
      return {...state, settings: {...state.settings, mathFontWeight: action.payload}}
    case SET_DOCUMENT_STARTNUMBERING:
      return {...state, settigns: {...state.settings, startNumbering: action.payload}}
    case SET_PAGE_MARGINS:
      return {...state, settings: {...state.settings, pageMargins: action.payload}}


    // view
    case ADD_PAGEBREAK_BEFORE:
      for (const i in state.order) {
        if (state.order[i] === action.payload) {
          return {...state, pagebreaks: [...state.pagebreaks, i]}
        }
      }
      return state
      
      
    
    default:
      return state
  }
}

export default document

