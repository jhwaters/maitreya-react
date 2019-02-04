import React from 'react'
import { MarkerDefs } from '.'


const translate = params => {
  const {x=0, y=0} = params
  return `translate(${x},${y})`
}

const scale = params => {
  const {x=1, y=1} = params
  return `scale(${x},${y})`
}

const matrix = params => {
  const [a=1, b=0, c=0, d=1, e=0, f=0] = params
  return `matrix(${a},${b},${c},${d},${e},${f})`
}

const makeTransform = props => {
  const {type, params} = props
  switch(type) {
    case 'matrix': return matrix(params)
    case 'scale': return scale(params)
    case 'translate': return translate(params)
    case 'invertXY': return matrix([0,1,1,0])
    default: return 'none'
  }
}

let styleCount = 0

export const Layer = props => {
  const { 
    transform, transformlist, style,
    strokeColor, strokeWidth
  } = props

  const layerprops = {}

  // STYLE
  let needDefs = false
  if (style || strokeColor || strokeWidth) {
    needDefs = true
    const layerstyle = {}
    const stylename = style ? `vg-style-${style}` : `vg-style-${++styleCount}`
    for (const markerName of ['arrowfwd', 'arrowrev', 'arrow', 'point', 'hole']) {
      layerstyle[`--vg-marker-${markerName}`] = `url(#${stylename}-marker-${markerName}`
    }
    if (strokeColor) { layerstyle['--vg-path-color'] = strokeColor }
    if (strokeWidth) { layerstyle['--vg-path-width'] = strokeWidth }
    layerprops.className = stylename
    layerprops.style = layerstyle
  }

  // TRANSFORMS
  if (transformlist) {
    const transforms = []
    for (const t of transformlist) {
      const [type, params={}] = typeof t === 'string' ? [t] : t
      const str = makeTransform({type, params})
      if (str !== 'none') {
        transforms.push(str)
      }
    }
    layerprops.transform = transforms.join(' ')
  } else if (transform) {
    const [type, params={}] = typeof transform === 'string' ? [transform] : transform
    const str = makeTransform({type, params})
    if (str) layerprops.transform = str
  }

  return (
    <g {...layerprops}>
      {needDefs ? <MarkerDefs stylename={layerprops.className}/> : null}
      {props.children}
    </g>
  ) 
}
