import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setFontFamilyUI } from '../../../actions/config'

class FontFamilyUI extends React.Component {
  static propTypes = {
    current: PropTypes.string,
    setFontFamilyUI: PropTypes.func.isRequired
  }

  setFontFamilyUI = (evt) => {
    this.props.setFontFamilyUI(evt.target.value)
  }

  render() {
    return (
      <select onChange={this.setFontFamilyUI} value={this.props.current}>
        <option value='input'>Input</option>
        <option value='select'>Menu</option>
      </select>
    )
  }
}

const mapStateToProps = state => ({
  current: state.config.fontFamilyUI
})

const mapDispatchToProps = dispatch => ({
  setFontFamilyUI: (inputtype) => dispatch(setFontFamilyUI(inputtype)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilyUI)