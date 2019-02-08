import {
  ADD_TO_DOCUMENT,
  CLEAR_ALL,
  REMOVE_LAST,
  UPDATE_ELEMENT,
  UPDATE_HEADER,
  SET_DOCUMENT_STARTNUMBERING,
  ADD_PAGEBREAK_BEFORE,
  DELETE_HEADER,
  DELETE_ELEMENT,
  CLEAR_PAGEBREAKS,
} from '../actions/document'



const initialState = {
  content: {},
  order: [],
  headers: {
    '0': ['PageHeader', {rows: []}],
    '1': [
      'PageHeader', {
        rows: [
          ['Assignment', 'Name ___'],
          [null, 'Date __ Class _'],
        ]
      }
    ],
  },
  footers: {},
  pagebreaks: [],
  startNumbering: 1,
}

const document = function(state=initialState, action) {
  switch (action.type) {
    // content
    case ADD_TO_DOCUMENT:
      return {
        ...state, 
        content: {
          ...state.content, 
          [+action.payload.id]: action.payload.element
        },
        order: [...state.order, +action.payload.id]
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
    case DELETE_HEADER:
      const headers = {...state.headers}
      if (+action.payload === 0 || +action.payload === 1) {
        headers[+action.payload] = ['PageHeader', {rows: []}]
        return {...state, headers}
      } else {
        delete headers[+action.payload]
        return {...state, headers}
      }
    case DELETE_ELEMENT:
      //Note that this does not remove the element from 'content', only from 'order'
      return {
        ...state, 
        order: state.order.filter(id => id !== +action.payload),
        pagebreaks: state.pagebreaks.filter(n => n < state.order.length),
      }
    case UPDATE_HEADER:
      return {
        ...state, 
        headers: {...state.headers, [+action.payload.id]: action.payload.data}
      }
    case UPDATE_ELEMENT:
      return {
        ...state, 
        content: {...state.content, [+action.payload.id]: action.payload.data}
      }


    // settings
    case SET_DOCUMENT_STARTNUMBERING:
      return {...state, startNumbering: action.payload}



    // view
    case ADD_PAGEBREAK_BEFORE:
      for (const i in state.order) {
        if (state.order[i] === action.payload) {
          return {...state, pagebreaks: [...state.pagebreaks, i]}
        }
      }
      return state
    case CLEAR_PAGEBREAKS:
      return {...state, pagebreaks: []}
      
    
    default:
      return state
  }
}

export default document

