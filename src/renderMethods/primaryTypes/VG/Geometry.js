import React from 'react'


export const Circle = (props) => {
  const {cx, cy, r, ...otherprops} = props
  return <circle className='vg-path geom-circle' cx={cx} cy={cy} r={r} {...otherprops} vectorEffect='non-scaling-stroke'/>
}

