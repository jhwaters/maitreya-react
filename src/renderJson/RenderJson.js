import React from 'react'
import { nonTerminal, terminal, childless } from './renderTypes'
import { Text, Plain } from './renderTypes/Text'

export const parseJson = function(json) {
  const [ type, props, ...children ] = json
  if (props) {
    if (props.constructor.name === 'Object') {
      return { type, props, children}
    }
    return { type, props: {}, children: [ props, ...children ] }
  }
  return { type, props: {}, children }
}

const isArray = Array.isArray

export const renderJson = function(json) {
  if (isArray(json)) {
    const {type, props, children} = parseJson(json)

    if (isArray(type)) {
      return React.createElement(React.Fragment, null, ...json.map(c => renderJson(c)))
    }
    if (childless[type]) {
      return React.createElement(childless[type], props)
    }
    if (terminal[type]) {
      return React.createElement(terminal[type], {...props, data: children.join('\n')})
    }
    if (nonTerminal[type]) {
      return React.createElement(nonTerminal[type], props, ...children.map(c => renderJson(c)))
    }
  }
  else if (typeof json === 'string') {
    return <Text data={json} />
  }
  else if (typeof json === 'number') {
    return <Plain data={json.toString()} />
  }
  else if (typeof json === 'boolean') {
    return <Plain data={json.toString()} />
  }
  else if (json === null || json === undefined) {
    return null
  }
  console.error(`cannot render ${JSON.stringify(json)}`)
  return null
}