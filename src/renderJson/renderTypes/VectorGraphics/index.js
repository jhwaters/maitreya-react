import {
  Canvas,
  Circle, 
  Label, 
  Transform,
  Polyline,
  Point,
} from './react-svgplot'

import Clip from './Clip'
import CoordinatePlane from './CoordinatePlane'
import Grid from './Grid'
import Path, { Asymptote } from './Path'
import { PolynomialFunction, RationalFunction } from './Functions'
import Style from './Style'

import './vgstyles.global.css'

export {
  Asymptote,
  Clip,
  CoordinatePlane,
  Grid,
  Label,
  Path,
  Point,
  Style,
}

const VectorGraphics = {
  Asymptote,
  Canvas,
  Circle,
  Clip,
  CoordinatePlane,
  Grid,
  Label,
  Path,
  Point,
  Polyline,
  PolynomialFunction,
  RationalFunction,
  Style,
  Transform,
}

export default VectorGraphics