import React from 'react'


export const Circle = props => {
  return <circle vectorEffect="inherit" {...props}/>
}

export const Ellipse = props => {
  return <ellipse vectorEffect="inherit" {...props}/>
}

export const Rect = props => {
  return <rect vectorEffect="inherit" {...updatePropsWithMarkers(props)}/>
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
  return <line vectorEffect="inherit" {...updatePropsWithMarkers(props)}/>
}

export const Polygon = props => {
  return <polygon vectorEffect="inherit" {...updatePropsWithMarkers(props)}/>
}

export const Polyline = props => {
  return <polyline vectorEffect="inherit" {...updatePropsWithMarkers(props)}/>
}

export const Path = props => {
  return (
    <path vectorEffect="inherit" {...updatePropsWithMarkers(props)}/>
  )
}

export const Point = props => {
  const {x, y, coords, marker="."} = props
  const pathprops = {}
  if (coords) {
    pathprops.d = `M${coords[0]},${coords[1]}Z`
  } else {
    pathprops.d = `M${x},${y}Z`
  }
  if (marker) {
    pathprops.markers = `--${marker}`
  }
  return <Path {...pathprops} />
}