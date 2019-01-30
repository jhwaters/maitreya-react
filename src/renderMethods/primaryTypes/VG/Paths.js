import React from 'react'

function pointFromArray(pt) {
  return `${pt[0]},${pt[1]}`
}


function pointFromXY(pt) {
  return `${pt.x},${pt.y}`
}

function XYtoArray(pt) {
  return [pt.x, pt.y]
}


export function pathFromPoints(points) {
  if (Array.isArray(points[0])) {
    return `M${points.map(p => `${p[0]},${p[1]}`).join('L')}`
  }
  return `M${points.map(p => `${p.x},${p.y}`).join('L')}`
}

export function scatterPathFromPoints(points) {
  if (Array.isArray(points[0])) {
    return points.map(p => `M${p[0]},${p[1]}`).join(' ')
  }
  return points.map(p => `M${p.x},${p.y}`).join(' ')
}


function interpolatePathCubicH(points) {
  const pts = Array.isArray(points[0]) ? points : points.map(p => [p.x, p.y])
  let d = `M ${pointFromArray(pts[0])}`
  let prev = pts[0]
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    const x1 = (2*prev[0] + p[0]) / 3
    const x2 = (prev[0] + 2*p[0]) / 3
    d += ` C ${x1},${prev[1]} ${x2},${p[1]} ${p[0]},${p[1]}`
    prev = p
  }
  return d
}


export const Path = (props) => {
  const {points, markers={}, role=[], effects={}, style, fill=false, connect=false} = props
  const classNames = ['vg-path']
  if (markers.start) classNames.push(`vg-path-marker-start-${markers.start}`)
  if (markers.mid) classNames.push(`vg-path-marker-mid-${markers.mid}`)
  if (markers.end) classNames.push(`vg-path-marker-end-${markers.end}`)
  if (fill) classNames.push(`vg-path-fill`)
  for (const r of role) {
    classNames.push(`vg-${r}`)
  }
  if (style) classNames.push(`vg-style=${style}`)
  let d = pathFromPoints(points)
  
  if (effects && effects.interpolate) {
    if (effects.interpolate === 'cubic-h') {
      d = interpolatePathCubicH(points)
    }
  } else {
    d = pathFromPoints(points)
  }
  
  if (connect) {
    d += 'z'
  }
  return (
    <path className={classNames.join(' ')}
      d={d}
      vectorEffect='non-scaling-stroke'
    />
  )
}

export const ScatterPlot = props => {
  const {points} = props
  return (
    <path className='vg-scatterplot' 
      d={scatterPathFromPoints(points)} 
      vectorEffect='non-scaling-stroke' />
  )
}


export const GeomSegment = (props) => {
  const {points, role=['segment'], style} = props
  return (
    <Path points={points} role={role} style={style} />
  )
}

export const GeomRay = (props) => {
  const {points, role=['ray'], style} = props
  return (
    <Path points={points} role={role} style={style} />
  )
}

export const GeomLine = (props) => {
  const {points, role=['line'], style} = props
  return (
    <Path points={points} role={role} style={style} />
  )
}

export const Asymptote = (props) => {
  const {points, role=['asymptote'], style} = props
  return (
    <Path points={points} role={role} style={style} />
  )
}

export const ShadedRegion = (props) => {
  const {points, role=[], style} = props
  const d = `${pathFromPoints(points)}z`
  const classNames = ['vg-shaded-region']
  for (const r of role) {
    classNames.push(`vg-${r}`)
  }
  if (style) classNames.push(`vg-style-${style}`)
  return <path className={classNames.join(' ')} d={d} vectorEffect='non-scaling-stroke'/>
}

export const Polygon = (props) => {
  const {vertices, marker='point', fill=false, role=[], style} = props
  const d = `${pathFromPoints(vertices)}z`
  const classNames = ['vg-path', 'vg-polygon']
  if (marker) classNames.push(`vg-path-marker-mid-${marker}`)
  if (fill) classNames.push(`vg-path-fill`)
  for (const r of role) {
    classNames.push(`vg-${r}`)
  }
  if (style) classNames.push(`vg-style=${style}`)
  return (
    <path d={d} className={classNames.join(' ')} vectorEffect='non-scaling-stroke'/>
  )
}