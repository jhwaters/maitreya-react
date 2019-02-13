import React from 'react'

import { RenderJson } from '../../../renderJson'

export const PreviewXYPlot = () => {
  
  
  const vasymptotes = [-3]
  const holes = [-5]
  const hasymptotes = [2]

  //const f = x => 2*Math.sin(x*Math.PI/4) + 7
  //const g = x => (x+2)*(x-8)/2 + (x+2)/5 + 5

  const f = x => (x-2)*(x-7) - 3 + (x/3)
  const g = x => -(x-2)*(x-7) - 3 + (x/3)


  const regionTop = []
  const regionBottom = []
  const fpoints = []
  const gpoints = []
  const step = 0.5

  let x = -5
  while (x <= 3) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += step
  }

  while (x <= 6) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += 0.02
  }

  while (x <= 11) {
    const fpt = ({x, y: f(x)})
    const gpt = ({x, y: g(x)})
    fpoints.push(fpt)
    gpoints.push(gpt)
    x += step
  }

  const json = [
    'CoordinatePlane', {span: [-10,-10,10,10], height: '3in'},
    [
      'Style', {name: 'asymptote'},
      ...vasymptotes.map(v => ['Path', {points: [[v, -12], [v, 12]]}]),
      ...hasymptotes.map(v => ['Path', {points: [[-12, v], [12, v]]}])
    ],
    [
      'Style', {name: 'primary'},
      ['Path', {points: fpoints, fill: 'solid'}],
      [
        'Transform', {type: 'translate', y: 2},
        [
          'RationalFunction', {
            numerLC: 2,
            asymptotes: vasymptotes,
            holes: holes,
            domain: [-11,-3],
            renderAsymptotes: false,
          }
        ],
      ],
      ['Point', {x: -4, y: 0}],
      ['Label', {x: -9, y: 7}, '$$f(x) = \\frac{1}{x-2}+2$$'],
    ],
    [
      'Style', {name: 'secondary'},
      ['Path', {points: gpoints, fill: 'solid'}],
      
      ['Point', {x: 2, y: f(2)}],
      ['Point', {x: 7, y: f(7)}],
      
    ]
  ]
  return <RenderJson json={json} />

  /*
  return (
    <CoordinatePlane span={[-10,-10,10,10]} width="3in">
      {vasymptotes.map(p => <Asymptote key={`va-${p}`} points={[{x: p, y: -12}, {x: p, y: 12}]} />)}
      {hasymptotes.map(p => <Asymptote key={`ha-${p}`} points={[{x: -12, y: p}, {x: 12, y: p}]} />)}
        
      <Layer style='function-2'>
        <FillRegion points={fpoints} />
        <Path points={fpoints} />
      </Layer>

      <Layer style='function-1'>
        <Layer transform={['translate', {y: 2}]}>
          <RationalFunction 
            numerLC={2}
            asymptotes={vasymptotes} 
            holes={holes} 
            domain={[-11,-3]} renderAsymptotes={false}
          />
        </Layer>
        <FillRegion points={gpoints}/>
        <Path points={gpoints}/>
        <Point x='-4' y='0' />
        <Point x='2' y={f(2)} />
        <Point x='7' y={f(7)} />
      </Layer>

    </CoordinatePlane>
  )
  */

}

export const PreviewGeom = () => {

  const poly= [
    [13,11], [17,12], [18,16], [15,18], [11,14]
  ]
  const ray = [[2,12], [7,13]]
  const line = [[8,17], [2,18]]
  const seg = [[7,15], [2,15]]
  const circ = ({cx: 4, cy: 7, r: 2})

  const json = [
    'CoordinatePlane', {span: [0,0,20,20], height: '3in', style: 'geometry'},
    ['Polygon', {points: poly, markers: "..."}],
    ['Path', {points: ray, markers: ".->"}],
    ['Path', {points: line, markers: "<->"}],
    ['Path', {points: seg, markers: ".-."}],
  ]

  return <RenderJson json={json} />

  /*
  return (
    <CoordinatePlane span={[0,0,20,20]} width='3in'>
      <Layer style='geometry'>
      <Polygon vertices={poly} />
      
      <Ray points={ray} />
      <Line points={line} />
      <Segment points={seg} />
      
      </Layer>
    </CoordinatePlane>
  )
  */
}