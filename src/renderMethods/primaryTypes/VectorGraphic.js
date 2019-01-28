import React from 'react'
import * as VG from './VG'

const SvgJsonML = (data, options) => {
  try {
    if (typeof data === 'string') {
      return data
    }
    let [type, props, ...children] = data
    if (props) {
      if (Array.isArray(props) || typeof props === 'string') {
        children.splice(0,0,props)
        props = {}
      }
    }
    const renderType = VG[type]
    return React.createElement(renderType, props, ...children.map(c => SvgJsonML(c, options)))
  } catch(e) {
    console.error(e)
    return null
  }
}

export const VectorGraphic = ({data, options}) => SvgJsonML(data, options)
