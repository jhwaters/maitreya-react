export const ADD_QUESTION = 'ADD_QUESTION'
export const CLEAR_ALL = 'CLEAR_ALL'
export const REMOVE_LAST = 'REMOVE_LAST'

let qid = 0

export const addQuestion = (question) => ({
  type: ADD_QUESTION,
  payload: {id: qid++, question: question},
})

export const clearAll = () => ({
  type: CLEAR_ALL
})

export const removeLast = () => ({
  type: REMOVE_LAST,
})