import { combineReducers } from 'redux'
import document from './document'
import config from './config'

const rootReducer = combineReducers({
  document: document,
  config: config,
})

export default rootReducer