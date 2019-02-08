import React from 'react'
import { Grid as SvgPlotGrid, Line, Style } from './react-svgplot'


const Grid = props => {
  const { span, step=[1,1], axis=true } = props
  const [x1, y1, x2, y2] = span
  const [xStep, yStep] = step

  return (
    <>
    <Style name="svgplot-grid">
      <SvgPlotGrid {...{x1, y1, x2, y2, xStep, yStep}} />
    </Style>
    {axis ? (
      <Style name="svgplot-axis">
        <Line x1={x1} y1={0} x2={x2} y2={0} markers="-->" />
        <Line x1={0} y1={y1} x2={0} y2={y2} markers="-->" />
      </Style>
    ) : null}
    </>
  )
}

export default Grid