import {
  ADD_LOCAL_FONT,
  SET_ALLOW_EDITING,
  SET_FONTFAMILY_UI,
  SET_SHOW_ANSWERKEY,
} from '../actions/config'

const initialState = {
  //titleBarStyle: 'default',
  localFonts: [],
  fontFamilyUI: 'select',
  showAnswerKey: true,
  allowEditing: true,
}

const config = function(state=initialState, action) {
  switch(action.type) {
    case ADD_LOCAL_FONT:
      return {...state, localFonts: [...state.localFonts, action.payload]}
    case SET_ALLOW_EDITING:
      return {...state, allowEditing: action.payload}
    case SET_FONTFAMILY_UI:
      return {...state, fontFamilyUI: action.payload}
    case SET_SHOW_ANSWERKEY:
      return {...state, showAnswerKey: action.payload}
    default:
      return state
  }
}

export default config