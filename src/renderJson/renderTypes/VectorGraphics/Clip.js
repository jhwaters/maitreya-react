import React from 'react'
import { Path } from '.'


let clipCount = 0

const Clip = props => {
  const {shape, id=`vg-clip-path-${++clipCount}`, children, ...shapeprops} = props
  let Elem
  if (shape === 'Path') {
    Elem = Path
  }
  else if (shape === 'Rect') {
    Elem = 'rect'
  }

  if (Elem) {
    return (
      <>
        <clipPath id={id}>
          {React.createElement(Elem, shapeprops)}
        </clipPath>
        <g clipPath={`url(#${id})`}>
          {props.children}
        </g>
      </>
    )
  }
  return props.children
}

export default Clip