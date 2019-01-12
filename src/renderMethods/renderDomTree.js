import React from 'react'
import renderElement from './renderElement'
import _ from 'lodash'

const renderChild = function(c, options) {
  if (Array.isArray(c)) {
    return renderDomTree(c, options)
  } else {
    return renderElement(c, options)
  }
}




const renderChildren = function(children, options) {
  return children.map(c => renderChild(c, options))
}




const renderDomTree = function(elem, options) {
  const tag = elem[0]

  if (Array.isArray(tag)) {
    return React.renderElement(React.Fragment, {}, ...renderChildren(elem))
  }

  let shouldRenderMath = options.shouldRenderMath
  if (_.includes(options.katex.ignoredTage, tag) || _.includes(options.katex.ignoredClasses, tag)) {
    shouldRenderMath = false
  }
  const newOptions = {...options, shouldRenderMath: shouldRenderMath}

  if (elem.length === 1) {
    return React.createElement(tag)

  } else if (elem.length === 2) {
    const props = elem[1]
    if (Array.isArray(props)) {
      return React.createElement(tag, {}, ...renderChildren(props, newOptions))
    } else if (typeof props === 'object') {
      return React.createElement(tag, props)
    } else {
      return React.createElement(tag, {}, renderChild(props, newOptions))
    }

  } else if (elem.length === 3) {
    const props = elem[1]
    const children = elem[2]
    if (Array.isArray(children)) {
      return React.createElement(tag, props, ...renderChildren(children, newOptions))
    } else {
      return React.createElement(tag, props, renderChild(children, newOptions))
    }
  } else {
    return JSON.stringify(elem)
  }
}


export default renderDomTree