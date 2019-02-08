import React from 'react'


let clipCount = 0

const Clip = props => {
  const {shape, id=`vg-clip-path-${++clipCount}`, children, ...shapeprops} = props
  return (
    <>
      <clipPath id={id}>
        {React.createElement(shape, shapeprops)}
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {props.children}
      </g>
    </>
  )
}

export default Clip