import React from 'react'
import { connect } from 'react-redux'
import AddLocalFont from './AddLocalFont'
import FontFamilyInput from './FontFamilyInput'
import FontFamilySelect from './FontFamilySelect'
import FontFamilyUI from './FontFamilyUI'
import MathFontSettings from './MathFont'
import TextPreview from './TextPreview'

const previewtext = `To solve an equation of the form $$ax^2 + bx + c = 0$$, use the quadratic formula:

$$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$$

Is it true that $$e^{i\\theta} = i\\sin{\\theta} + \\cos{\\theta}$$?`


export const SettingsPage = (props) => {
  return (
    <div>
      <h2>Settings <button onClick={props.onRequestClose}>Close</button></h2>
      <h3>Fonts</h3>
      <h4>Document Font</h4>
      Font: {props.fontFamilyUI === 'input' ? <FontFamilyInput applyButton={false}/> : <FontFamilySelect />}
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
    </div>
  )
}

const mapStateToProps = state => ({
  fontFamilyUI: state.config.fontFamilyUI
})


export default connect(mapStateToProps)(SettingsPage)