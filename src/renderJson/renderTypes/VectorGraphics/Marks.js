import React from 'react'

export const Mark = props => {
  const {x, y, coords} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  const classNames = ['vg-mark']

  return (
    <path className={classNames.join(' ')}
      vectorEffect='non-scaling-stroke'
      d={d}
    />
  )
}

export const Point = props => {
  const {x, y, coords} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  const classNames = ['vg-mark', 'vg-point']

  return (
    <path className={classNames.join(' ')}
      vectorEffect='non-scaling-stroke'
      d={d}
    />
  )
}

export const Hole = props => {
  const {x, y, coords} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  const classNames = ['vg-mark', 'vg-hole']

  return (
    <path className={classNames.join(' ')}
      vectorEffect='non-scaling-stroke'
      d={d}
    />
  )
}