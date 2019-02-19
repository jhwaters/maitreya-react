import React from 'react'
import FontFamily from './FontFamily'
import FontLoader from './FontLoader'
import MathFontSettings from './MathFontSettings'
import FontFamilyUI from './FontFamilyUI'
import AddLocalFont from './AddLocalFont'
import TextPreview from './TextPreview'

const previewtext = `To solve an equation of the form $$ax^2 + bx + c = 0$$, use the *quadratic formula*:

$$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$$

The angles of $$\\triangle{ABC}$$ add to $$180\\degree$$.

The **volume** of a sphere is $$\\frac{4}{3}\\pi r^3$$.

***Remember*** that $$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$.

It can be difficult to distinguish between J I l 1.`


const FontSettings = () => {
  return (
    <>
      <h4>Document Font</h4>
      <div>
        Font Selection Method: <FontFamilyUI />
      </div>
      <div>
        Font: <FontFamily/> 
        <FontLoader type="button"/>
      </div>
      <h4>Math Font</h4>
      <div style={{justifyItems: 'right'}}>
        <MathFontSettings />
      </div>
      <h4>Preview</h4>
      <div style={{display: 'flex', flexDirection: 'row', '--doc-font-size': '11pt'}}>
        <TextPreview wrapperElement='div' defaultValue={previewtext} style={{input: {height: '100%'}, output: {height: '100%'}}}/>      
      </div>
    </>
  )
}

export default FontSettings