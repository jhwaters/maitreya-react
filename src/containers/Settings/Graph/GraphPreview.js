import React from 'react'
import { 
  CartesianPlane, Grid,
  Asymptote, Point, Hole, ShadedRegion,
} from '../../../renderMethods/primaryTypes/Graph'

import { Function, Parametric } from '../../../renderMethods/special/GraphParametric'


const GraphPreview = () => {
  
  const g = (x) => 1.2*(x+1) - 4

  const f = (x) => {
    return 0.03*(x+8)*(x+1)*(x-9) + g(x)
  }

  const regionTop = []
  const regionBottom = []
  let x = -1
  while (x <= 9) {
    regionTop.push({x, y: g(x)})
    regionBottom.push({x, y: f(x)})
    x += 0.2
  }
  const region = [...regionBottom, ...regionTop.reverse()]

  const points = [-1, 9].map(x => ({x, y: f(x)}))
  const holes = [-5].map(x => ({x, y: f(x)}))
  const vasymptotes = [-8]

  return (
    <div className='document preview-area'>
      <CartesianPlane start={[-10,-10]} stop={[10,10]} height="2in">
        <Grid {...{start: [-10,-10], stop: [10,10]}} />
        <ShadedRegion points={region} />
        <Parametric y="1.2*(t+1)-4" domain={[-10,10]}/>
        <Function y="0.03*(x+8)*(x+1)*(x-9) + 1.2*(x+1)-4" domain={[-10,10]}/>
        {vasymptotes.map(p => <Asymptote key={`va${p}`} points={[{x: p, y: -10}, {x: p, y: 10}]} />)}
        {points.map(p => <Point key={`pt${p.x}`} {...p} />)}
        {holes.map(p => <Hole key={`hole${p.x}`} {...p} />)}
      </CartesianPlane>
    </div>
  )
}

export default GraphPreview