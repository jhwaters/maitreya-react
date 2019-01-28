import React from 'react'

export const Rotate = (props) => {
  const deg = props.degrees !== undefined ? props.degrees : props.radians * 180 / Math.PI 
  return (
    <g transform={`rotate(${deg})`}>
      {props.children}
    </g>
  )
}

