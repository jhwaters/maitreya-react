import React from 'react'
import { 
  CartesianPlane, Path,
  Asymptote, Point, Hole, ShadedRegion,
  RationalFunction, Transforms,

  Circle, Polygon, GeomRay, GeomLine, GeomSegment,
} from '../../../renderMethods/primaryTypes/VG'


export const PreviewXYPlot = () => {
  
  
  const vasymptotes = [-3]
  const holes = [-5]
  const hasymptotes = [2]


  const g = (x) => (x+2)*(x-8)/2 + (x+2)/5 + 5

  const f = x => 2*Math.sin(x*Math.PI/4) + 7

  const regionTop = []
  const regionBottom = []
  const fpoints = []
  const gpoints = []
  const step = 0.3

  let x = -11
  while (x <= -2) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += step
  }

  x = -2
  while (x <= 8) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    regionTop.push(fpt)
    regionBottom.push(gpt)
    x += step
  }

  x = 8
  while (x <= 11) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += step
  }

  

  const region = [...regionBottom, ...regionTop.reverse()]

  return (
    <CartesianPlane span={[-10,-10,10,10]} autogrid={true} width="3in">
      {vasymptotes.map(p => <Asymptote key={`va-${p}`} points={[{x: p, y: -12}, {x: p, y: 12}]} />)}
      {hasymptotes.map(p => <Asymptote key={`ha-${p}`} points={[{x: -12, y: p}, {x: 12, y: p}]} />)}
      <Transforms list={[{type: 'translate', params: {x: 0, y: 2}}]}>
        <RationalFunction 
          style={'xyplot2'}
          numerLC={2}
          asymptotes={vasymptotes} 
          holes={holes} 
          domain={[-11,-3]} renderAsymptotes={false}
        />
      </Transforms>
      <ShadedRegion points={region} />
      <Path points={fpoints} />
      <Path points={gpoints} />
      <Point coords={[-2,5]} />
      <Point coords={[8,7]} />
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
      <GeomRay points={ray} />
      <GeomLine points={line} />
      <GeomSegment points={seg} />
    </CartesianPlane>
  )
}