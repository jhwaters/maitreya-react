import React from 'react'
import renderData from './renderData'
import renderElement from './renderElement'

const isArray = Array.isArray

const renderJsonMLChild = function(child, options) {
  if (typeof child === 'string') {
    return renderData(child, 'text', options)
  } else if (typeof child === 'number') {
    return <span>{child.toString()}</span>
  } else if (isArray(child)) {
    return renderJsonML(child, options)
  } else if (child.constructor === Object) {
    return renderElement(child, options)
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


const renderJsonML = function(data, options) {
  const parsed = parseJsonML(data)
  if (parsed) {
    return React.createElement(parsed.tagname, parsed.props, ...parsed.children.map(c => renderJsonMLChild(c, options)))
  } else {
    return null
  }
}

export default renderJsonML