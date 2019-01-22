export const ADD_LOCAL_FONT = 'ADD_LOCAL_FONT'
export const SET_ALLOW_EDITING = 'SET_ALLOW_EDITING'
export const SET_FONTFAMILY_UI = 'SET_FONTFAMILY_UI'
export const SET_SHOW_ANSWERKEY = 'SET_SHOW_ANSWERKEY'

export const addLocalFont = (font) => ({
  type: 'ADD_LOCAL_FONT',
  payload: font
})

export const setAllowEditing = (b) => ({
  type: SET_ALLOW_EDITING,
  payload: b
})

export const setFontFamilyUI = (inputType) => ({
  type: SET_FONTFAMILY_UI,
  payload: inputType
})

export const setShowAnswerKey = (bool) => ({
  type: SET_SHOW_ANSWERKEY,
  payload: bool
})
