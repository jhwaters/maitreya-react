import React from 'react'
import { MarkerSymbols, MarkerDefs } from '.'

export const Canvas = props => {
  const {span, height, width, cartesian=true} = props
  const [x1, y1, x2, y2] = span

  const svgprops = { viewBox: `${x1} ${y1} ${x2-x1} ${y2-y1}` }

  /*
  let canvasScale
  if (height) {
    canvasScale = height / (y2-y1)
  }
  if (width) {
    const ws = width / (x2-x1)
    if (ws < canvasScale) {
      canvasScale = ws
    }
  }
  if (canvasScale) {
    svgprops.style = {'--vg-canvas-scale': canvasScale}
  }
  */
  
  if (height !== undefined) { svgprops.height = height }
  if (width !== undefined) { svgprops.width = width }
  svgprops.className = 'vg-canvas'
  if (props.className !== undefined) { svgprops.className += ' ' + props.className }
  
  return (
    <svg {...svgprops} >
      <MarkerSymbols />
      <g className='vg-axis'>
        <MarkerDefs stylename='vg-axis'/>
      </g>
      {cartesian ? (
        <g className='vg-cartesian' 
          transform={`matrix(1,0,0,-1,0,${y1+y2})`}
          style={{'--vg-text-transform': `scale(1,-1)`}}
        >
          {props.children}
        </g>
      ) : (
        <>
          {props.children}
        </>
      )}
    </svg>
  )
}