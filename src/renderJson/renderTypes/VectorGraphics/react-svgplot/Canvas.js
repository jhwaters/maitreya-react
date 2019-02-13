import React from 'react'
import { MarkerSymbols } from './Style'


const Canvas = props => {
  const {cartesian=true, x1, x2, y1, y2, width, height, preserveAspectRatio} = props
  const svgprops = {width, height, preserveAspectRatio}
  const gprops = {vectorEffect: 'non-scaling-stroke'}
  if (cartesian && cartesian !== "false") {
    gprops.transform = 'scale(1,-1)'
    svgprops.viewBox = `${x1} ${-y2} ${x2-x1} ${y2-y1}`
  } else {
    svgprops.viewBox = `${x1} ${y1} ${x2-x1} ${y2-y1}`
  }
  return (
    <svg className='svgplot-canvas' {...svgprops} >
      <MarkerSymbols />
      <g {...gprops}>
        {props.children}
      </g>
    </svg>
  )
}

export default Canvas