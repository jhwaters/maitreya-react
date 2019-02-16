import {
  Canvas,
  Circle, 
  Ellipse,
  Label,
  Overlay,
  Point,
  Rect,
  Transform,
} from './react-svgplot'

import Clip from './Clip'
import CoordinatePlane from './CoordinatePlane'
import Grid from './Grid'
import Layer from './Layer'
import Path, { Asymptote, ScatterPlot, Polygon } from './Path'
import { PolynomialFunction, RationalFunction } from './Functions'
import Style from './Style'

import './vgstyles.global.css'

export {
  Asymptote,
  Circle,
  Clip,
  CoordinatePlane,
  Ellipse,
  Grid,
  Label,
  Layer,
  Overlay,
  Path,
  Point,
  Polygon,
  Rect,
  ScatterPlot,
  Style,
}

const VectorGraphics = {
  Asymptote,
  Canvas,
  Circle,
  Clip,
  CoordinatePlane,
  Ellipse,
  Grid,
  Label,
  Layer,
  Overlay,
  Path,
  Point,
  Polygon,
  PolynomialFunction,
  RationalFunction,
  Rect,
  ScatterPlot,
  Style,
  Transform,
}

export default VectorGraphics