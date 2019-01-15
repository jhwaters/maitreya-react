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
    fontFamily: 'PT Serif',
    fontSize: '9pt',
    startNumbering: 1,
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
      return initialState;
    case REMOVE_LAST:
      const lastId = state.order[-1]
      let newquestions = {...state.questions}
      delete newquestions[lastId]
      return {
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

