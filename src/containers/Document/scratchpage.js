import React from 'react'
import Page from './Page'
import { renderJson, RenderJson } from '../../renderJson'
import { Math, DisplayMath } from '../../renderJson/renderTypes/Math'
import Text from '../../renderJson/renderTypes/Text'
import {
  CoordinatePlane, Label, Path, Style, Grid
} from '../../renderJson/renderTypes/VectorGraphics'
import { includes } from 'lodash'

import styles from './scratch.module.css'


const a = () => (
  <svg viewBox="-6 -11 17 17" height="2in" xmlns="http://www/w3/org/2000/svg">
    <g transform="scale(1,-1)">
      <g style={{stroke: 'rgba(0,0,200,0.5)'}}>
        <Grid span={[-5,-5,10,10]} />
      </g>
      <circle cx="2" cy="2" r="0.2"/>
      <foreignObject className={styles.FO} x="2" y="2" width="1000" height="1000">
        <div className={styles.Div1}>
          <div className={styles.Div2} anchor="NW">
            <span>Anchor NW</span>
          </div>
        </div>
        <div className={styles.Div1}>
          <div className={styles.Div2} anchor="NE">
            <span>Anchor NE</span>
          </div>
        </div>
        <div className={styles.Div1}>
          <div className={styles.Div2} anchor="SW">
            <span>Anchor SW</span>
          </div>
        </div>
        <div className={styles.Div1}>
          <div className={styles.Div2} anchor="SE">
            <span>Anchor SE</span>
          </div>
        </div>
      </foreignObject>
    </g>
  </svg>
)

const [x, y] = [1,1]

const json = [
  [
    'CoordinatePlane', {span: [-2,-2,10,10], height: '2in', },
    ['Layer', {vectorEffect: 'non-scaling-stroke'},
      ['Path', {points: '1,1 5,2 6,7'}],
      ['Point', {x, y}],
      ...['NE', 'NW', 'SE', 'SW'].map(a => [
        'Label', {x, y, anchor: a, padding: '2mm'}, `$$f(x) = ${a}$$`
      ])
    ]
  ],
  /*
  [
    'Canvas', {x1: -2, y1: -2, x2: 10, y2: 10},
    ['Grid', {span: [-2,-2,10,10]}],
    [
      'Style', {name: 'red'},
      [
        'Transform', {type: 'rotate', params: ['30deg']},
        ['Point', {x: 4, y: 2}],
        ['Label', {x: 4, y: 2}, '$$f(x) = x - 3$$'],
      ]
    ]
  ]
  */
]




const Scratch = () => {


  return (
    <Page>
      <p>Scratch Page</p>
      <div className='page-content'>
        <RenderJson json={json}/>
        <svg viewBox="-11 -11 22 22" height="2in" vectorEffect="non-scaling-stroke" >
          <g style={{stroke: 'black', fill: 'none'}} vectorEffect="inherit" transform="scale(1,-1)">
            <polyline points="-10 0 10 0" vectorEffect="inherit"/>
            <polyline points="0 -10 0 10" vectorEffect="inherit"/>
            <rect x="-10" y="-10" width="20" height="20" vectorEffect="inherit"/>
            <circle cx="3" cy="5" r="1" fill="blue" vectorEffect="non-scaling-stroke"/>
            <foreignObject x="2" y="-9" height="7" width="7" style={{border: '1px solid blue'}}>
              <div >
                <RenderJson json={['Text', '$$f(x) = x^2 - \\sqrt{3}$$']} />
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    </Page>
  )
}

export default Scratch