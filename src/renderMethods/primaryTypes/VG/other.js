import React from 'react'

export const Layer = (props) => {
  return (
    <g {...props}>
      {props.children}
    </g>
  )
}

export const Text = (props) => {
  const {x, y, children, ...otherprops} = props
  return (
    <text className='vg-text' x={x} y={-y} {...otherprops} transform='scale(1,-1)' vectorEffect='non-scaling-stroke'>
      {props.children}
    </text>
  )
}

export const Rotate = (props) => {
  const deg = props.degrees !== undefined ? props.degrees : props.radians * 180 / Math.PI 
  return (
    <g transform={`rotate(${deg})`}>
      {props.children}
    </g>
  )
}

