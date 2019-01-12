import { defaultsDeep } from 'lodash'
import { defaultOptions } from './defaultOptions'
import renderData from './renderData'


const renderElement = function(elem, options={}) {
  const opts = defaultsDeep({}, elem.options || {}, options, defaultOptions)
  if (elem.type) {
    return renderData(elem.data, elem.type, opts)
  } else {
    return renderData(elem, 'text', opts)
  }
}

export default renderElement