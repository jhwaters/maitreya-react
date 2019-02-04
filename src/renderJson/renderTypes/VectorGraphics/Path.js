import React from 'react'

const markerClassNames = s => {
  const positions = ['start', 'mid', 'end']
  const markers = {}
  if (s && s.length === 3) {
    for (let i=0; i<3; i++) {
      const c = s[i]
      if (c === '>') markers[positions[i]] = 'arrowfwd'
      else if (c === '<') markers[positions[i]] = 'arrowrev'
      else if (c === '.') markers[positions[i]] = 'point'
      else if (c === 'o') markers[positions[i]] = 'hole'
      else if (c === '-') markers[positions[i]] = 'none'
      else markers[positions[i]] = ''
    }
  }
  return Object.keys(markers).map(k => `vg-mark-${k}-${markers[k]}`)
}

function pointFromArray(pt) {
  return `${pt[0]},${pt[1]}`
}

export function pathFromPoints(points) {
  if (Array.isArray(points[0])) {
    return `M${points.map(p => `${p[0]},${p[1]}`).join('L')}`
  }
  return `M${points.map(p => `${p.x},${p.y}`).join('L')}`
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



export const Path = props => {
  const {d, points, markers, interpolate, className, style} = props
  const markerprops = {}
  const classNames = ['vg-path']
  if (style) {
    if (typeof style === 'string') {
      classNames.push(`vg-path-${style}`)
    }
    else {
      for (const s of style) {
        classNames.push(`vg-path-${s}`)
      }
    }
  }
  if (className) classNames.push(className)
  if (d) {
    return (
      <path className={[...classNames, ...markerClassNames(markers)].join(' ')} 
      d={d} {...markerprops} vectorEffect='non-scaling-stroke'/>
    )
  } else if (points) {
    let dd
    if (interpolate === 'cubic-h') {
      dd = interpolatePathCubicH(points)
    } else {
      dd = pathFromPoints(points)
    }
    return (
      <path className={[...classNames, ...markerClassNames(markers)].join(' ')} 
      d={dd} {...markerprops} vectorEffect='non-scaling-stroke'/>
    )
  }
  return null
}

export const Asymptote = props => <Path {...props} className='vg-asymptote'/>
export const Ray = props => <Path {...props} className='vg-ray'/>
export const Segment = props => <Path {...props} className='vg-segment'/>
export const Line = props => <Path {...props} className='vg-line'/>
export const ScatterPlot = props => <Path {...props} className='vg-scatterplot'/>

export const FillRegion = props => {
  const {d, points, interpolate} = props
  if (d) {
    return (
      <path className='vg-fillregion'  
      d={d} vectorEffect='non-scaling-stroke'/>
    )
  } else if (points) {
    let dd
    if (interpolate === 'cubic-h') {
      dd = interpolatePathCubicH(points)
    } else {
      dd = pathFromPoints(points)
    }
    return (
      <path className='vg-fillregion' 
      d={dd} vectorEffect='non-scaling-stroke'/>
    )
  }
  return null
}

export const Polygon = props => {
  const { vertices } = props
  const d = pathFromPoints(vertices) + 'z'
  return <path d={d} className='vg-path vg-polygon' vectorEffect='non-scaling-stroke'/>
}