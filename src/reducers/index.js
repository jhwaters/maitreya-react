import { combineReducers } from 'redux'
import document from './document'
import config from './config'
import style from './style'

const rootReducer = combineReducers({
  config, document, style
})

export default rootReducer