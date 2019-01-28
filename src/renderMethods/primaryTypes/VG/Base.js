import React from 'react'
import { pathFromPoints } from './tools'


export const Layer = (props) => {
  return (
    <g {...props}>
      {props.children}
    </g>
  )
}

export const Path = (props) => {
  const {points, ...otherprops} = props
  return (
    <path className='vg-element vg-path'
      vectorEffect='non-scaling-stroke'
      d={pathFromPoints(points)}
      {...otherprops}
    />
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