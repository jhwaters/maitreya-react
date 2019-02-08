import React from 'react'

const Grid = (props) => {
  const {x1, y1, x2, y2, xStep=1, yStep=1} = props

  const xvals = [], yvals = []
  if (xStep) {
    let t = x1
    while (t <= x2) {
      xvals.push(t)
      t += xStep
    }
  }
  if (yStep) {
    let t = y1
    while (t <= y2) {
      yvals.push(t)
      t += yStep
    }
  }

  return (
    <>
      {xvals.map(v => (
        <line key={`x-${v}`}
          x1={v} x2={v} y1={y1} y2={y2} 
          vectorEffect='non-scaling-stroke'/>
      ))}
      {yvals.map(v => (
        <line key={`y-${v}`}
          y1={v} y2={v} x1={x1} x2={x2} 
          vectorEffect='non-scaling-stroke'/>
      ))}
    </>
  )
}

export default Grid