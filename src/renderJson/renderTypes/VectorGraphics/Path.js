import React from 'react'
import { Path as SPPath, Polyline, Polygon as SPPolygon } from './react-svgplot'
import { polylineFromPoints } from './funcs'
import { Style } from '.'


const renderPath = props => {
  const {d, points, markers, fill, connect=false} = props
  if (d) {
    return <SPPath d={d} markers={markers} fill={fill} />
  }
  else if (points) {
    if (connect) {
      return <SPPolygon points={polylineFromPoints(points)} markers={markers} fill={fill} />
    }
    return <Polyline points={polylineFromPoints(points)} markers={markers} fill={fill} />
  }
  return null
}

export const Path = props => {
  const {style} = props
  if (style) {
    return <Style name={style}>{renderPath(props)}</Style>
  }
  return renderPath(props)
}

export default Path
export const Asymptote = props => <Path style="asymptote" {...props}/>
export const ScatterPlot = props => <Path style="scatterplot" {...props}/>
export const Polygon = props => <Path connect={true} {...props}/>
