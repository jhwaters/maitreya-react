import React from 'react'
import Page from './Page'
import { renderJson } from '../../renderJson'
import { includes } from 'lodash'



const graph = [
  'ABVG',
  [
    'CoordinatePlane', {span: [-10,-10,10,10], height: '3in'},

    [
      'Layer', { style: 'function-1' },
      ['PolynomialFunction', {coefficients: [9, 0, -1], domain: [-10,10]}],
      ['RationalFunction', {
        holes: [-5],
        roots: [-3], asymptotes: [4], domain: [-10,10]
      }],
    ],
    [
      'Layer', {style: 'function-2'},
      ['Ray', {points: [[0,0], [7,-3]]}],
      ['FillRegion', {points: [[-9,9], [-3,9], [-5,5]]}],
    ]
  ]
]


const Scratch = () => {


  return (
    <Page>
      <h1>Scratch Page</h1>
      {renderJson(graph)}
    </Page>
  )
}

export default Scratch