import React from 'react'
import FontFamily from './FontFamily'
import MathFontSettings from './MathFontSettings'
import FontFamilyUI from './FontFamilyUI'
import AddLocalFont from './AddLocalFont'
import TextPreview from './TextPreview'

const previewtext = `To solve an equation of the form $$ax^2 + bx + c = 0$$, use the quadratic formula:

$$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$$

The volume of a sphere is $$\\frac{4}{3}\\pi r^3$$.

Remember that $$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$.`


const FontSettings = () => {
  return (
    <>
      <h4>Document Font</h4>
      Font: <FontFamily/> 
      <div>
        Font Selection Method: <FontFamilyUI />
      </div>
      <div>
        Add Local Font to Menu: <AddLocalFont buttonLabel="Add To List" /> (You will then need to select it from the menu)
      </div>
      <h4>Math Font</h4>
      <div style={{justifyItems: 'right'}}>
        <MathFontSettings />
      </div>
      <h4>Preview</h4>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <TextPreview defaultValue={previewtext} />      
      </div>
    </>
  )
}

export default FontSettings