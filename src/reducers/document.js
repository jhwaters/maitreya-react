import {
  ADD_TO_DOCUMENT,
  CLEAR_ALL,
  REMOVE_LAST,
  UPDATE_ELEMENT,
  SET_DOCUMENT_STARTNUMBERING,
  ADD_PAGEBREAK_BEFORE,
  DELETE_ELEMENT,
} from '../actions/document'



const initialState = {
  content: {},
  order: [],
  headers: {
    1: {
      type: 'header',
      data: [
        {left: 'Assignment', right: 'Name ___'},
        {right: 'Date __ Class _'},
      ],
    },
    default: {type: 'header', data: []},
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
      if (typeof action.payload === 'string') {
        if (action.payload.split('.')[0] === 'header') {
          return {
            ...state, headers: {...state.headers, [action.payload.split('.')[1]]: {type: 'header', data: []}}
          }
        }

      }
      //Note that this does not remove the element from 'content', only from 'order'
      return {
        ...state, 
        order: state.order.filter(id => id !== action.payload),
        pagebreaks: state.pagebreaks.filter(n => n < state.order.length),
      }
    case UPDATE_ELEMENT:
      if (typeof action.payload.id === 'string') {
        if (action.payload.id.split('.')[0] === 'header') {
          return {
            ...state, 
            headers: {...state.headers, [action.payload.id.split('.')[1]]: action.payload.element}}
        }
      }
      return {
        ...state, 
        content: {...state.content, [action.payload.id]: action.payload.element}
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
      
      
    
    default:
      return state
  }
}

export default document

