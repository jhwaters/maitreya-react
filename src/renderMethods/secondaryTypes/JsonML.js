import React from 'react'
import { RenderElement } from '../RenderElement'

const isArray = Array.isArray

const renderJsonMLChild = function(child, options) {
  if (isArray(child)) {
    try {
      return <JsonML data={child} options={options} />
    } catch(e) {
      return <code className="error error-render">{JSON.stringify(child)}</code>
    }
  } else {
    return <RenderElement content={child} inherited={options} />
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

export const JsonML = ({data, options}) => {
  const parsed = parseJsonML(data)
  if (parsed) {
    return React.createElement(
      parsed.tagname, 
      parsed.props, 
      ...parsed.children.map(c => renderJsonMLChild(c, options))
    )
  } else {
    return null
  }
}