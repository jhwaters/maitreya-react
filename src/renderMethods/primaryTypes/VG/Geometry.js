import React from 'react'
import { Path } from './Base'
import { pathFromPoints } from './tools'

export const Segment = (props) => (
  <Path points={props.endpoints} {...{className: 'vg-path vg-path-segment', ...props}} />
)

export const Ray = (props) => (
  <Path points={props.endpoints} {...{className: 'vg-path vg-path-ray', ...props}} />
)

export const Line = (props) => (
  <Path points={props.endpoints} {...{className: 'vg-path vg-path-line', ...props}} />
)

export const Circle = (props) => {
  const {cx, cy, r, ...otherprops} = props
  return <circle className='vg-path geom-circle' cx={cx} cy={cy} r={r} {...otherprops} vectorEffect='non-scaling-stroke'/>
}

export const Polygon = (props) => {
  const {vertices, labels} = props
  const d = `${pathFromPoints(vertices)}z`
  return (
    <path d={d} className='vg-path vg-polygon' vectorEffect='non-scaling-stroke'/>
  )
}