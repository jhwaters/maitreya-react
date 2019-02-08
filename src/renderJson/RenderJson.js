import React from 'react'
import renderTypes from './renderTypes'
import Text from './renderTypes/Text'
import { parseJson } from './parseJson'

const isArray = Array.isArray

export function renderJson(json) {
  if (isArray(json)) {
    const {type, props, children} = parseJson(json)

    if (isArray(type)) {
      return React.createElement(React.Fragment, null, ...json.map(c => renderJson(c)))
    }
    const RenderType = renderTypes[type]
    if (RenderType === Text) {
      return React.createElement(Text, props, ...children)
    }
    if (RenderType) {
      return React.createElement(RenderType, props, ...children.map(c => renderJson(c)))
    }
  }
  else if (typeof json === 'string') {
    return <Text>{json}</Text>
  }
  else if (typeof json === 'number') {
    return <Text>{json.toString()}</Text>
  }
  else if (typeof json === 'boolean') {
    return <Text>{json.toString()}</Text>
  }
  else if (json === null || json === undefined) {
    return null
  }
  console.error(`cannot render ${json}`)
  return null
}

export const RenderJson = props => {
  return renderJson(props.json)
}