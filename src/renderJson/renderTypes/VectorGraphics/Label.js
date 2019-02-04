import React from 'react'

let labelCount = 0

export const Label = props => {
  const {x, y} = props
  const labelID = `vg-label-${++labelCount}`
  return (
    <>
      <defs>
        <text id={labelID} vectorEffect='non-scaling-stroke' className='vg-text'>
          {props.children}
        </text>
      </defs>
      <g className='vg-text-wrapper'>
        <use xlinkHref={`#${labelID}`} x={x} y={y} />
      </g>
    </>
  )
}