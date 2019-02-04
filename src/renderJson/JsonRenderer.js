import React from 'react'
import { parseJson } from './parseJson'

const isArray = Array.isArray

export class JsonRenderer {
  constructor(handled, unhandled={}){
    this.handled = handled
    this.unhandled = unhandled
  }

  handleError(message) {
    console.error(`Cannot render ${message}`)
    return null
  }

  handleString(str) {
    return str
  }

  handleNumber(n) {
    return n
  }

  handleBoolean(b) {
    return b.toString()
  }

  handleNull() {
    return null
  }

  handleArray(arr) {
    const {type, props, children} = parseJson(arr)
    const UnhandledType = this.unhandled[type]
    if (UnhandledType) {
      return UnhandledType({...props, children})
    }
    const RenderType = this.handled[type]
    if (RenderType) {
      return React.createElement(RenderType, props, ...children.map(c => this.render(c)))
    }
    return this.handleError(arr)
  }

  render(json) {
    if (isArray(json)) {
      return this.handleArray(json)
    }
    if (typeof json === 'string') {
      return this.handleString(json)
    }
    if (typeof json === 'number') {
      return this.handleNumber(json)
    }
    if (typeof json === 'boolean') {
      return this.handleBoolean(json)
    }
    if (json === null || json === undefined) {
      return this.handleNull()
    }
    return this.handleError(JSON.stringify(json))
  }
}