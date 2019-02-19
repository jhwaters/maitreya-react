export const ADD_FONTFAMILY = 'ADD_FONTFAMILY'
export const SET_ALLOW_EDITING = 'SET_ALLOW_EDITING'
export const SET_FONTFAMILY_UI = 'SET_FONTFAMILY_UI'
export const SET_SHOW_ANSWERKEY = 'SET_SHOW_ANSWERKEY'
export const SET_HIDDEN_COUNT = 'SET_HIDDEN_COUNT'
export const SET_UI_THEME = 'SET_UI_THEME'
export const SET_DEBUG_VIEW = 'SET_DEBUG_VIEW'

export const addFontFamily = (font) => ({
  type: ADD_FONTFAMILY,
  payload: font,
})

export const setAllowEditing = (b) => ({
  type: SET_ALLOW_EDITING,
  payload: b,
})

export const setFontFamilyUI = (inputType) => ({
  type: SET_FONTFAMILY_UI,
  payload: inputType,
})

export const setShowAnswerKey = (bool) => ({
  type: SET_SHOW_ANSWERKEY,
  payload: bool,
})

export const setHiddenCount = (n) => ({
  type: SET_HIDDEN_COUNT,
  payload: n,
})

export const setUITheme = theme => {
  if (theme === 'none') {
    document.body.removeAttribute('ui-theme')
  } else {
    document.body.setAttribute('ui-theme', theme)
  }
  return ({
    type: SET_UI_THEME,
    payload: theme,
  })
}

export const setDebugView = bool => ({
  type: SET_DEBUG_VIEW,
  payload: bool
})

