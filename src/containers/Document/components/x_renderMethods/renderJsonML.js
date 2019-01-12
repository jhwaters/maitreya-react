import React from 'react'
import renderElement from './renderElement'
import { defaultsDeep } from 'lodash'

const isArray = Array.isArray

const renderJsonMLChild = function(child, options) {
  if (typeof child === 'string') {
    return renderElement({
      data: child,
      type: 'text',
      options: options,
    })
  } else if (typeof child === 'number') {
    return renderElement({
      data: child.toString(),
      type: 'text',
      options: options,
    })
  } else if (isArray(child)) {
    return renderJsonML(child, options)
  } else if (child.constructor === Object) {
    return renderElement({
      data: child.data,
      type: child.type || 'text',
      options: defaultsDeep({}, child.options || {}, options)
    })
  }
}

const parseJsonML = function(data) {
  if (typeof data[0] === 'string') {
    const tagname = data[0]
    let props = {}
    let children = []
    let i = 1
    if (data[1]) {
      if (data[1].constructor === Object) {
        for (const k in data[1]) {
          if (k === 'children') {
            children = data[1][k]
          } else {
            props[k] = data[1][k]
          }
        }
        i = 2
      }
    }
    children = children.concat(data.slice(i))
    return {tagname: tagname, props: props, children: children}
  }
  return null
}


export const renderJsonML = function(data, options) {
  const parsed = parseJsonMl(data)
  if (parsed) {
    return React.createElement(parsed.tagname, parsed.props, ...parsed.children.map(c => renderJsonMLChild(c, options)))
  } else {
    return null
  }
}
