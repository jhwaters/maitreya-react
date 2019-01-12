import {
  ADD_QUESTION,
  CLEAR_ALL,
  REMOVE_LAST,
} from '../actions/document'

const initialState = {
  questions: {},
  order: [],
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
    default:
      return state
  }
}

export default document

