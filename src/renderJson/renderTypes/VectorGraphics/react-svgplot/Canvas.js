import React from 'react'
import { MarkerSymbols } from './Style'


const Canvas = props => {
  const {cartesian=true, x1, x2, y1, y2, width, height} = props
  const svgprops = {width, height}
  if (cartesian && cartesian !== "false") {
    svgprops.transform = 'scale(1,-1)'
    svgprops.viewBox = `${x1} ${y1} ${x2-x1} ${y2-y1}`
  } else {
    svgprops.viewBox = `${x1} ${y1} ${x2-x1} ${y2-y1}`
  }
  return (
    <svg className='svgplot-canvas' {...svgprops} >
      <MarkerSymbols />
      {props.children}
    </svg>
  )
}

export default Canvas