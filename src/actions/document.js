export const ADD_QUESTION = 'ADD_QUESTION'
export const CLEAR_ALL = 'CLEAR_ALL'
export const REMOVE_LAST = 'REMOVE_LAST'
export const UPDATE_DOCUMENT_SETTINGS = 'UPDATE_DOCUMENT_CONFIG'

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

export const updateDocumentSettings = (props) => ({
  type: UPDATE_DOCUMENT_SETTINGS,
  payload: props,
})

export const setStartNumbering = (startat) => updateDocumentSettings({startNumbering: startat})

export const setDocumentFontFamily = (fontFamily) => {
  return updateDocumentSettings({fontFamily: fontFamily})
}

export const setDocumentFontSize = (fontSize) => {
  return updateDocumentSettings({fontSize: fontSize})
}