import React from 'react'
import Page from './Page'
import { renderJson } from '../../renderJson'
import {
  CoordinatePlane, Label, Path, Style
} from '../../renderJson/renderTypes/VectorGraphics'
import { includes } from 'lodash'


const json = [
  'CoordinatePlane', {span: [-10,-10,10,10], height: '3in'},
  [
    'Style', {name: 'primary function'},
    ['Path', {d: 'M-3,-3 L -7,1 L 5,2'}]
  ]
]


const Scratch = () => {


  return (
    <Page>
      <h1>Scratch Page</h1>
      <CoordinatePlane span="-10 -10 10 10" height="2in"/>
    </Page>
  )
}

export default Scratch