import React from 'react'

import { Canvas } from './Canvas'
import { CartesianPlane as CoordinatePlane } from './CartesianPlane'
import { PolynomialFunction, RationalFunction } from './Functions'
import { Axis, Grid } from './Grid'
import { ClipRect, ClipPath } from './Clip'
import { MarkerSymbols, MarkerDefs } from './Markers'
import { Point, Hole } from './Marks'
import { Layer } from './Layer'
import { 
  Asymptote, FillRegion, Line, Path, Polygon, 
  Ray, ScatterPlot, Segment, 
} from './Path'
import { Label } from './Label'
import { JsonRenderer } from '../../JsonRenderer'

import './vg.global.css'

const renderTypes = {
  Asymptote,
  Axis,
  Canvas,
  ClipPath,
  ClipRect,
  CoordinatePlane,
  FillRegion,
  Grid,
  Hole,
  Label,
  Layer,
  Line,
  MarkerDefs,
  MarkerSymbols,
  Path,
  Point,
  Polygon,
  PolynomialFunction,
  RationalFunction,
  Ray,
  ScatterPlot,
  Segment,
}

const VGRenderer = new JsonRenderer(renderTypes)
const RenderVG = props => VGRenderer.render(props.json)

const AbstractVectorGraphics = props => {
  return (
    <>
      {props.children.map((c,i) => <RenderVG key={i} json={c}/>)}
    </>
  )
}

export default AbstractVectorGraphics

export {
  Asymptote,
  Axis,
  Canvas,
  ClipPath,
  ClipRect,
  CoordinatePlane,
  FillRegion,
  Grid,
  Hole,
  Label,
  Layer,
  Line,
  MarkerDefs,
  MarkerSymbols,
  Path,
  Point,
  Polygon,
  PolynomialFunction,
  RationalFunction,
  Ray,
  ScatterPlot,
  Segment,
}
