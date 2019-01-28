import React from 'react'
import Page from './Page'
import { RenderElement } from '../../renderMethods'
import { includes } from 'lodash'
import {
  CartesianPlane, Path, Text,
} from '../../renderMethods/primaryTypes/VG'



const Scratch = () => {
  const style = {
    display: 'flex',
  }

  return (
    <Page>

      <CartesianPlane span={[-5,-5,10,10]} autogrid={true} width='4in'
        style={{'--cartesianTranslate': 'translate(0,5)'}}
      >
        <g>
          <Text x='1' y='8' style={{
            fontSize: '2px', 
          }}>Hello!</Text>
        </g>
      </CartesianPlane>
    </Page>
  )
}

export default Scratch