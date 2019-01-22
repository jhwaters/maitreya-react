import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setFontFamilyUI } from '../../actions/config'

class FontFamilyUI extends React.Component {
  static propTypes = {
    default: PropTypes.string,
    setFontFamilyUI: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.selection = React.createRef()
  }

  setFontFamilyUI = () => {
    const value = this.selection.current.value
    this.props.setFontFamilyUI(value)
  }

  render() {
    return (
      <select ref={this.selection} onChange={this.setFontFamilyUI} defaultValue={this.props.default}>
        <option value='input'>Input</option>
        <option value='select'>Menu</option>
      </select>
    )
  }
}

const mapStateToProps = state => ({
  default: state.config.fontFamilyUI
})

const mapDispatchToProps = dispatch => ({
  setFontFamilyUI: (inputtype) => dispatch(setFontFamilyUI(inputtype)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilyUI)