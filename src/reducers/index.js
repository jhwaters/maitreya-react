import { combineReducers } from 'redux'
import document from './document'
import config from './config'

const rootReducer = combineReducers({
  config, document
})

export default rootReducer