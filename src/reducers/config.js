import {
  ADD_LOCAL_FONT,
} from '../actions/config'

const initialState = {
  titleBarStyle: 'default',
  localFonts: [],
}

const config = function(state=initialState, action) {
  switch(action.type) {
    case ADD_LOCAL_FONT:
      return {
        ...state,
        localFonts: [...state.localFonts, action.payload]
      }
    default:
      return state
  }
}

export default config