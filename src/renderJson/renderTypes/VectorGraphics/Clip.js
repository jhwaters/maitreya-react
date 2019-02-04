import React from 'react'
import { pathFromPoints } from './Path'

let clipCount = 0

export const ClipRect = props => {
  const {id=`vg-clip-path-${++clipCount}`, span} = props
  const [x1, y1, x2, y2] = span
  return (
    <>
    <clipPath id={id}>
      <rect x={x1} y={y1} width={x2-x1} height={y2-y1} />
    </clipPath>
    <g clipPath={`url(#${id})`}>
      {props.children}
    </g>
    </>
  )
}

export const ClipPath = props => {
  const {id=`vg-clip-path-${++clipCount}`, d, points} = props
  let dd
  if (d) {
    dd = d
  } else {
    dd = pathFromPoints(points)
  }
  return (
    <>
    <clipPath id={id}>
      <path d={dd} />
    </clipPath>
    <g clipPath={`url(#${id})`}>
      {props.children}
    </g>
    </>
  )
}