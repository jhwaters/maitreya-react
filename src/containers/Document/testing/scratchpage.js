import React from 'react'
import Page from '../Page'
import { renderJson, RenderJson } from '../../../renderJson'
import { Math, DisplayMath } from '../../../renderJson/renderTypes/Math'
import Text from '../../../renderJson/renderTypes/Text'
import {
  CoordinatePlane, Label, Path, Style, Grid
} from '../../../renderJson/renderTypes/VectorGraphics'
import { includes } from 'lodash'
import FontTest from './FontTest'

import styles from './scratch.module.css'


const jsx = (
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

const [x, y] = [2.5,1.5]

const angles = [0, 45, 90, 135, 180]

const json = [
  [
    'CoordinatePlane', {span: [-2,-2,10,10], width: '2in', },
    ['Path', {points: '1,1 7,1', markers: '-->'}],
    ['Path', {points: '1,1 5,5', markers: '-->'}],
    ['Point', {x: 1, y: 1}],
    ['AngleMark', {x: 1, y: 1, radius: 2, start: 0, end: 315}],
  ],
]




const Scratch = () => {
  const torender = []
  for (const fontSize of ['8pt', '9pt', '10pt']) {
    for (const fontFamily of ['katex_main', 'CMU Serif WOFF', 'CMU Serif TTF', 
    'CMU Concrete WOFF', 'CMU Concrete TTF']) {
      torender.push({fontSize, fontFamily})
    }
  }

  return (
    <Page>
      <div className="page-content">
        {torender.map(p => <FontTest key={p.fontFamily + p.fontSize} {...p}/>)}      
      </div>
    </Page>
  )
}

export default Scratch