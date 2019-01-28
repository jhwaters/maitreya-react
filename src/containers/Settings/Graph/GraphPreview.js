import React from 'react'
import { 
  CartesianPlane, Grid, Path, Text,
  Asymptote, Point, Hole, ShadedRegion,

  Circle, Polygon, Ray, Line, Segment,
} from '../../../renderMethods/primaryTypes/VG'


export const PreviewXYPlot = () => {
  
  const g = (x) => 1.2*(x+1) - 4

  const f = (x) => {
    return 0.03*(x+8)*(x+1)*(x-9) + g(x)
  }

  const regionTop = []
  const regionBottom = []
  const fpoints = []
  const gpoints = []
  const step = 0.2

  let x = -11
  while (x < -1) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += step
  }

  x = -1
  while (x <= 9) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    regionTop.push(gpt)
    regionBottom.push(fpt)
    x += 0.2
  }

  while (x < 11) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += step
  }
  
  const region = [...regionBottom, ...regionTop.reverse()]
  const points = [-1, 9].map(x => ({x, y: f(x)}))
  const holes = [-5].map(x => ({x, y: f(x)}))
  const vasymptotes = [-8]

  return (
    <CartesianPlane span={[-10,-10,10,10]} autogrid={true} width="3in">
      <ShadedRegion points={region} />
      <Path points={fpoints} />
      <Path points={gpoints} />
      {vasymptotes.map(p => <Asymptote key={`va${p}`} points={[{x: p, y: -12}, {x: p, y: 12}]} />)}
      {points.map(p => <Point key={`pt${p.x}`} {...p} />)}
      {holes.map(p => <Hole key={`hole${p.x}`} {...p} />)}
    </CartesianPlane>
  )
}

export const PreviewGeom = () => {

  const poly= [
    [13,11], [17,12], [18,16], [15,18], [11,14]
  ]
  const ray = [[2,12], [7,13]]
  const line = [[8,17], [2,18]]
  const seg = [[7,15], [2,15]]
  const circ = ({cx: 4, cy: 7, r: 2})

  return (
    <CartesianPlane span={[0,0,20,20]} style='geom' autogrid={true} width='3in'>
      <Polygon vertices={poly} />
      <Circle {...circ} />
      <Ray endpoints={ray} />
      <Line endpoints={line} />
      <Segment endpoints={seg} />
    </CartesianPlane>
  )
}