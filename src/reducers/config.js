import {
  ADD_FONTFAMILY,
  SET_ALLOW_EDITING,
  SET_FONTFAMILY_UI,
  SET_SHOW_ANSWERKEY,
  SET_HIDDEN_COUNT,
  SET_UI_THEME,
  SET_DEBUG_VIEW,
} from '../actions/config'

const initialState = {
  //titleBarStyle: 'default',
  localFonts: [],
  fontFamilyUI: 'select',
  showAnswerKey: true,
  allowEditing: true,
  numberHidden: 0,
  uiTheme: 'none',
  debugView: false,
}

const config = function(state=initialState, action) {
  switch(action.type) {
    case ADD_FONTFAMILY:
      return {
        ...state, 
        localFonts: [...state.localFonts.filter(f => f !== action.payload), action.payload],
      }
    case SET_ALLOW_EDITING:
      return {...state, allowEditing: action.payload}
    case SET_FONTFAMILY_UI:
      return {...state, fontFamilyUI: action.payload}
    case SET_SHOW_ANSWERKEY:
      return {...state, showAnswerKey: action.payload}
    case SET_HIDDEN_COUNT:
      return {...state, numberHidden: action.payload}
    case SET_UI_THEME:
      return {...state, uiTheme: action.payload}
    case SET_DEBUG_VIEW:
      return {...state, debugView: action.payload}
    default:
      return state
  }
}

export default config