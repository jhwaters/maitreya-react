import React from 'react'
import { connect } from 'react-redux'
import FontFamilyInput from './FontFamilyInput'
import FontFamilySelect from './FontFamilySelect'

const FontFamily = ({fontFamilyUI}) => (
  fontFamilyUI === 'input' ? <FontFamilyInput/> : <FontFamilySelect/>
)

const mapStateToProps = state => ({fontFamilyUI: state.config.fontFamilyUI})

export default connect(mapStateToProps)(FontFamily)
