import React from 'react'
import { Canvas, Layer, Grid, ClipRect, Axis } from '.'

export const CartesianPlane = props => {
  const {span, width, height} = props
  const [x1, y1, x2, y2] = span
  const w = x2 - x1
  const h = y2 - y1
  const pad = Math.min(w, h) * 0.05
  return (
    <Canvas span={[x1-pad, y1-pad, x2+pad, y2+pad]} 
      cartesian={true} 
      width={width} height={height}
    >
      <Grid span={span}/>
      <Axis x1={x1} x2={x2} y1={0} y2={0} />
      <Axis x1={0} x2={0} y1={y1} y2={y2} />
      <Layer style='function-1'>
        <ClipRect span={span}>
          {props.children}
        </ClipRect>
      </Layer>
    </Canvas>
  )
}