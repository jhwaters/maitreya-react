import React from 'react'
import { RenderJson } from '../../../renderJson'
import { FontTest as Generator } from '../../../questions/generatortests'





const FontTest = props => {
  const { fontFamily, fontSize } = props
  //const json = new Generator().output()
  //delete question[1].content.diagram
  //delete question[1].content.answer
  const json = ['Markdown',
          `${fontFamily}-${fontSize}:`,
          'Given that line _l_ has a _y-intercept_ of 1 and _l_ $$\\perp$$ _JL_,',
          'determine the equation in ___slope-intercept___ form for _l_.  ',
          '__Remember__, you can use _point-slope_ form $$y - y_1 = m(x - x_1)$$ to',
          'come up with the equation.'
        ]
        /*
        diagram: [
          'CoordinatePlane', {span: "-10,-5 10,5", height: '.8in'},
          ['Point', {x: -6, y: 2}],
          ['Point', {x: 4, y: -3}],
          ['Overlay', {x: -6, y: 2, anchor: 'E', displacement: '1mm'}, '_J_'],
          ['Overlay', {x: 4, y: -3, anchor: 'W', displacement: '1mm'}, '_L_'],
        ],
        answer: {
          choices: [
            '_y = 2x + 1_',
            '_y = 3x - 67_',
            '_y = 4x + 89_',
            '_y = 5x + 10_',
          ],
          //listDirection: 'horizontal',
        },
        */

  return (
    <>
    <div style={{
      '--doc-font-family': fontFamily, 
      '--doc-font-size': fontSize, 
      fontFamily, 
      fontSize,
      width: '80%',
    }}>
      <RenderJson json={json}/>
    </div>
    </>
  )
}

export default FontTest