import {
  ADD_QUESTION,
  CLEAR_ALL,
  REMOVE_LAST,
  UPDATE_DOCUMENT_SETTINGS,
} from '../actions/document'

const initialState = {
  questions: {},
  order: [],
  settings: {
    fontFamily: 'Lora',
    fontSize: '8pt',
    startNumbering: 1,
    pageMargins: '10mm',
  },
}

const document = function(state=initialState, action) {
  switch (action.type) {
    case ADD_QUESTION:
      return {
        ...state, 
        questions: {
          ...state.questions, 
          [action.payload.id]: action.payload.question,
        },
        order: [...state.order, action.payload.id],
      }
    case CLEAR_ALL:
      return {
        ...state,
        questions: {},
        order: [],
      }
    case REMOVE_LAST:
      const lastId = state.order[-1]
      let newquestions = {...state.questions}
      delete newquestions[lastId]
      return {
        ...state,
        questions: newquestions,
        order: state.order.slice(0,-1),
      }
    case UPDATE_DOCUMENT_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        }
      }
    default:
      return state
  }
}

export default document

