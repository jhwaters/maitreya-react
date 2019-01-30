import React from 'react'

export const Mark = props => {
  const {x, y, coords, roles=[], style} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  const classNames = ['vg-mark']
  for (const r of roles) {
    classNames.push(`vg-${r}`)
  }
  if (style) classNames.push(`vg-style=${style}`)
  return (
    <path className={classNames.join(' ')}
      vectorEffect='non-scaling-stroke'
      d={d}
    />
  )
}

export const Point = props => {
  const {x, y, coords, roles=[], style} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  const classNames = ['vg-mark', 'vg-point']
  for (const r of roles) {
    classNames.push(`vg-${r}`)
  }
  if (style) classNames.push(`vg-style=${style}`)
  return (
    <path className={classNames.join(' ')}
      vectorEffect='non-scaling-stroke'
      d={d}
    />
  )
}

export const Hole = props => {
  const {x, y, coords, roles=[], style} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  const classNames = ['vg-mark', 'vg-hole']
  for (const r of roles) {
    classNames.push(`vg-${r}`)
  }
  if (style) classNames.push(`vg-style=${style}`)
  return (
    <path className={classNames.join(' ')}
      vectorEffect='non-scaling-stroke'
      d={d}
    />
  )
}