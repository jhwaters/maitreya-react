import React from 'react'
import Path from './Path'

const AngleMark = props => {
  const {start, end, ...otherprops} = props

  let {x, y, coords} = props
  if (coords) {
    x = coords[0]
    y = coords[1]
  }

  let {radius, maxRadius, minRadius} = props

  const angleSize = end - start
  if (maxRadius || minRadius) {
    if (minRadius === undefined) {
      minRadius = maxRadius * 0.5
    }
    if (maxRadius === undefined) {
      maxRadius = minRadius * 2
    }
    if (angleSize < 90) {
      const diff = maxRadius - minRadius
      radius = minRadius + diff*(90-angleSize)/90
    }
  }
  if (radius === undefined) {
    radius = minRadius
  }
  

  const startAngle = parseFloat(start) * Math.PI / 180
  const endAngle = parseFloat(end) * Math.PI / 180
  const arcStart = {
    x: x + Math.cos(startAngle) * radius, 
    y: y + Math.sin(startAngle) * radius,
  }
  const arcEnd = {
    x: x + Math.cos(endAngle) * radius,
    y: y + Math.sin(endAngle) * radius,
  }
  let d = coords ? `M${coords[0]},${coords[1]}` : `M${x},${y}`
  d += ` L ${arcStart.x},${arcStart.y}`
  d += ` A ${radius} ${radius} 0 ${end-start > 180 ? 1 : 0} 1`
  d += ` ${arcEnd.x},${arcEnd.y} z`
  return <Path style="anglemark" fill="solid" {...otherprops} d={d}/> 
}

export default AngleMark