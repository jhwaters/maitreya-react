import React from 'react'


export const Circle = props => {
  return <circle {...props} vectorEffect="non-scaling-stroke" />
}

export const Ellipse = props => {
  return <ellipse {...props} vectorEffect="non-scaling-stroke" />
}

export const Rect = props => {
  return <rect vectorEffect="non-scaling-stroke" {...updatePropsWithMarkers(props)}/>
}

const markerProps = s => {
  const positions = ['Start', 'Mid', 'End']
  const markers = {}
  if (s && s.length === 3) {
    for (let i=0; i<3; i++) {
      const c = s[i]
      if (c === '>') markers[`marker${positions[i]}`] = 'arrowfwd'
      else if (c === '<') markers[`marker${positions[i]}`]  = 'arrowrev'
      else if (c === '.') markers[`marker${positions[i]}`]  = 'point'
      else if (c === 'o') markers[`marker${positions[i]}`]  = 'hole'
    }
  }
  return markers
}


function updatePropsWithMarkers(props) {
  if (props.markers) {
    return {...props, ...markerProps(props.markers)}
  }
  return props
}

export const Line = props => {
  return <line vectorEffect="non-scaling-stroke" {...updatePropsWithMarkers(props)}/>
}

export const Polygon = props => {
  return <polygon vectorEffect="non-scaling-stroke" {...updatePropsWithMarkers(props)}/>
}

export const Polyline = props => {
  return <polyline vectorEffect="non-scaling-stroke" {...updatePropsWithMarkers(props)}/>
}

export const Path = props => {
  return (
    <path vectorEffect="non-scaling-stroke" {...updatePropsWithMarkers(props)}/>
  )
}

export const Point = props => {
  const {x, y, marker="."} = props
  const pathprops = {d: `M${x},${y}Z`}
  if (marker) {
    pathprops.markers = `--${marker}`
  }
  return <Path {...pathprops} />
}